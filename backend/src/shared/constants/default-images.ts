export const DEFAULT_STATIC_AVATAR_IMAGES = [
  "blue.png",
  "yellow.png",
  "brown.png",
  "green.png",
  "pirple.png",
];
export const DEFAULT_STATIC_QUIZ_FILE_NAME = "default.png";

export function getRandomAvatar(): string {
  const randomIndex = Math.floor(
    Math.random() * DEFAULT_STATIC_AVATAR_IMAGES.length,
  );
  return DEFAULT_STATIC_AVATAR_IMAGES[randomIndex];
}
