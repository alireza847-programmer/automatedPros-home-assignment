import { Pressable, Share, StyleSheet } from 'react-native';
import { AppText } from '../appText';
import { colors } from '@/theme/colors';
import { StoryDto } from '@/hooks/queries/types/story';

interface ShareButtonProps {
  story: StoryDto;
}

const ShareButton: React.FC<ShareButtonProps> = ({ story }) => {
  const onShare = async () => {
    try {
      await Share.share({
        message: `${story.title}\n\n${story.url || ''}`,
        url: story.url,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <Pressable onPress={onShare} style={styles.container}>
      <AppText style={styles.text}>Share</AppText>
    </Pressable>
  );
};

export default ShareButton;

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  text: {
    color: colors.accent,
    fontSize: 16,
  },
});
