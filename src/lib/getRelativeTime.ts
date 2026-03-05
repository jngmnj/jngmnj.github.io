export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // 미래 날짜인 경우
  if (diffInSeconds < 0) {
    return '방금 전';
  }

  const intervals = [
    { label: '년', seconds: 31536000 }, // 365 * 24 * 60 * 60
    { label: '달', seconds: 2592000 }, // 30 * 24 * 60 * 60
    { label: '주', seconds: 604800 }, // 7 * 24 * 60 * 60
    { label: '일', seconds: 86400 }, // 24 * 60 * 60
    { label: '시간', seconds: 3600 }, // 60 * 60
    { label: '분', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return `${count}${interval.label} 전`;
    }
  }

  return '방금 전';
}
