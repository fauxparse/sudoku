export default function setName(n: number): string {
  switch (n) {
    case 2:
      return 'pair';
    case 3:
      return 'triple';
    case 4:
      return 'quad';
    default:
      return 'set';
  }
}
