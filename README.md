# HackerNews Feed — React Native Technical Assessment

---

## 1. Setup & Running the App

### Prerequisites

- Node.js 18+
- React Native CLI: `npm install -g react-native-cli`
- Android Studio (API 30+) or Xcode 14+ (iOS 14+)
- CocoaPods (iOS): `sudo gem install cocoapods`

### Installation

```bash
git clone <repo-url> && cd HackerNewsFeed
npm install
cd ios && pod install && cd ..
```

### Environment

Create a `.env` file in the project root:

```
API_BASE_URL=https://hacker-news.firebaseio.com/v0/
```

### Run

```bash
# Android
npx react-native run-android

# iOS
npx react-native run-ios
```

### Tests

```bash
npm test
```

---

## 2. Architecture Decisions

### Folder Structure — Feature-based

```
src/
├── screens/          # One folder per screen, self-contained
├── components/       # Shared, single-responsibility UI components
├── hooks/queries/    # All React Query data-fetching hooks
├── store/            # Zustand slices (bookmarks, scroll position)
├── utils/            # Pure, stateless utilities (sorting, filtering, time, URL)
├── theme/            # Design tokens (colors, spacing, radius, typography)
└── navigation/       # Navigator config and typed param lists
```

This keeps business logic out of components and makes each layer independently testable.

### State Management — Zustand

Zustand was chosen over Redux Toolkit for two reasons specific to this project:

- **Minimal boilerplate**: bookmarks and scroll position are simple slices that do not need reducers, action creators, or selectors. Zustand collapses all of that into a single `create()` call.
- **Persistence is a first-class plugin** (`zustand/middleware persist`) — wiring AsyncStorage took three lines, vs. the redux-persist configuration overhead.

Redux Toolkit would be the right call on a 12+ screen app with complex server-state synchronisation, optimistic updates, or middleware chains. At this scope, it would be overengineering.

### Server State — React Query (@tanstack/react-query)

React Query handles all API data: caching, background refetch, loading/error/stale states, and pull-to-refresh. The `queryKey: [topStories]` means the 20 story fetches are shared across the Home and Bookmarks screens with zero duplicate network calls.

### Bookmark Persistence — AsyncStorage

AsyncStorage was chosen over MMKV because it is the zero-config default and the data set is tiny (an array of integers). MMKV would be the correct choice if bookmark data grew large or if synchronous reads were needed to avoid a flash on cold start. The trade-off is accepted and documented here.

### Image Loading — react-native-fast-image

FastImage provides HTTP cache-control headers, priority queueing, and significantly faster image loading on Android compared to the built-in `Image` component. Favicon images are fetched via Google's favicon API so no third-party image CDN registration is required.

### Navigation — React Navigation v6 (Native Stack)

`NativeStackNavigator` was used instead of the JS stack for native-platform transitions and lower overhead. A typed `RootStackParamList` enforces param safety at compile time.

---

## 3. Known Trade-offs

- **`getItemLayout` uses a fixed `ROW_SIZE` constant.** Items with very long titles will wrap and exceed that height, causing scroll restoration to land slightly off. A production fix would measure item heights with `onLayout` and cache them.

- **Scroll position resets on cold restart.** The scroll offset is saved to an in-memory Zustand store. Navigation-back restoration works correctly (as required), but a full cold-start restoration would require persisting the offset to AsyncStorage.

---

## 4. Technical Questions

### Q1 — Bridge vs JSI & The New Architecture

The legacy Bridge was an asynchronous, serialised JSON bus between the JavaScript thread and the native side. Every call — whether a touch event, a layout measurement, or a module method — was JSON-serialised, sent across the bridge, deserialised, executed natively, serialised again, and returned. Because this is asynchronous and batched, there is an inherent latency floor, and the JS thread and the native thread cannot share memory directly.

JSI (JavaScript Interface) replaces that bus with a C++ layer that the JS engine (Hermes) can call synchronously. JS holds a direct reference to a C++ host object — no serialisation, no batching, no thread-hop required for synchronous reads. This eliminates the bridge congestion that caused choppy animations when many events fired simultaneously.

Fabric is the new renderer built on JSI. It moves layout calculation to C++ (Yoga), lets the UI thread read JS-computed values synchronously during the commit phase, and enables concurrent rendering. TurboModules replace the old NativeModules registry: modules are loaded lazily (on first access rather than at startup) and their type signatures are statically known, which removes the dynamic lookup overhead and speeds up cold start.

### Q2 — Diagnosing a Janky FlatList

**Step 1 — Diagnose with tooling.** Open the Flipper Performance plugin or the React DevTools Profiler. Enable "Highlight renders" to see which components re-render on scroll. On Android, systrace or the GPU rendering bars in Developer Options reveal whether jank is UI-thread or JS-thread bound.

**Step 2 — Check `keyExtractor` and `getItemLayout`.** Without `getItemLayout`, FlatList cannot pre-calculate item positions and must measure each item on mount, causing layout thrash. Without a stable `keyExtractor`, items are unmounted and remounted on data changes instead of being reused.

**Step 3 — Reduce `renderItem` complexity.** Extract the item component, wrap it in `React.memo`, and memoize all callback props with `useCallback`. Run the profiler again to confirm the component stops re-rendering when its data has not changed.

**Step 4 — Tune FlatList batch settings.** The defaults (`windowSize={21}`, `maxToRenderPerBatch={10}`) render far too many items at once on mid-range hardware. Reducing `windowSize` to 5 and `maxToRenderPerBatch` to 5 limits the off-screen render budget. Add `removeClippedSubviews` on Android to unmount off-screen native views.

**Step 5 — Move heavy work off the render path.** If items contain images, switch to `react-native-fast-image` for memory-efficient decoding. If items run complex derivations, memoize them with `useMemo` inside the item component, not the parent, so work is per-item and incremental.

### Q3 — useCallback and useMemo

**A measurable benefit:** In a FlatList with 500 items, the `renderItem` prop is passed to every item cell as a new function reference on every parent re-render. Without `useCallback`, each re-render causes all 500 `memo`-wrapped item components to see a new reference and re-render unnecessarily. Wrapping `renderItem` in `useCallback` with a stable dependency array means the reference is stable, and `React.memo` on the item component can bail out correctly. This is directly measurable in the React DevTools profiler as a drop from N wasted renders to zero.

**A case where `useMemo` makes things worse:** Wrapping a trivial computation — such as `` const label = useMemo(() => `${count} items`, [count]) `` — adds the overhead of closure allocation, dependency array comparison, and cache storage on every render, all to avoid a string interpolation that takes nanoseconds. The memo overhead exceeds the computation cost. `useMemo` is only worth it when the wrapped computation is genuinely expensive (heavy sort/filter over large arrays) or when referential stability of an object or array is needed to prevent downstream memo bailout failures.

### Q4 — State Management Decision

**Context API** is the right tool for low-frequency, narrow state — a theme toggle or auth token that rarely changes and is consumed by a small subtree. Its weakness is that any state update re-renders every consumer in the tree, so it does not scale to frequently-updated or widely-shared state without aggressive memoisation that negates its simplicity advantage.

**Redux Toolkit** is the mature choice for large, team-scale apps. Its strengths are predictable unidirectional data flow, excellent DevTools time-travel debugging, a mature middleware ecosystem (RTK Query, thunks, sagas), and patterns that enforce consistency across large engineering teams. The cost is boilerplate and a steeper learning curve.

**Zustand** sits between the two. It has virtually no boilerplate, supports fine-grained subscriptions (consumers only re-render when the specific slice they select changes), integrates with persistence and devtools middleware, and scales well for medium-complexity apps. It lacks the strong conventions of Redux, which can lead to inconsistency on large teams.

For this 12-screen app I would choose **Zustand** for local UI state (sort preference, scroll position, bookmarks) paired with **React Query** for all server state. This combination covers auth, caching, and background sync without needing Redux at all. I would reconsider Redux Toolkit if the team exceeded ~8 engineers, if complex optimistic updates with rollback were required, or if deep debugging of state history became a daily concern.

### Q5 — Offline-First UX Strategy

**Detection:** `@react-native-community/netinfo` provides a real-time connectivity stream. Subscribe in a top-level provider and surface a banner when `isConnected` is false. Do not block the UI — show stale data with a banner rather than a hard error.

**Caching strategy:** React Query's built-in cache covers the in-session case. For cross-session offline support, persist the query cache to AsyncStorage using `@tanstack/query-async-storage-persister`. This lets the app render last-known data immediately on cold start without a network round-trip.

**Cache invalidation:** Set `staleTime` to a value appropriate to how frequently the data changes (e.g. 5 minutes for a news feed). On reconnect, React Query automatically refetches stale queries in the background. For write operations, queue mutations locally (a simple Zustand slice or the `react-native-offline` library) and replay them on reconnect.

**Libraries:** `@react-native-community/netinfo` for detection, `@tanstack/react-query` with the AsyncStorage persister for read caching, and `react-native-mmkv` as the storage layer if synchronous reads on cold start matter.

**Trade-offs:** The main risk is staleness — the user may act on outdated data. Write-operation conflict resolution (when a queued mutation meets a changed server state) adds meaningful complexity and would require a product-level decision on the merge strategy.

---

## 5. Testing

### Unit test — `sortStories` utility

Tests the core sorting logic in `src/utils/sorting.ts`: verifies that score sort orders by descending score, time sort orders by descending timestamp, and both handle empty arrays without throwing.

### Component interaction test — `StoryItem`

Uses React Native Testing Library to render a `StoryItem` with a mock story, asserts the title and domain are visible, and simulates a press to verify `navigation.navigate` is called with the correct screen and params.

---

## 6. Bonus Features Implemented

- **Bookmarks** — `BookmarksScreen` filters the cached top-stories list by bookmarked IDs. Swipe-to-remove is implemented via `ReanimatedSwipeable` from `react-native-gesture-handler`.
- **Debounced search** — `AppSearchInput` maintains local state and fires the parent callback after a configurable debounce (default 300 ms). No additional API calls are made; filtering runs client-side over the cached result.
- **Offline banner** — `OfflineBanner` subscribes to NetInfo and renders a red banner when `isConnected` is false. It self-manages connectivity state internally so the parent only needs to pass `isVisible`.
