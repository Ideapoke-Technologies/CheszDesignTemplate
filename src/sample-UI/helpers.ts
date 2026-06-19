export function formatDate(dateStr: string): string {
  const [m, d, y] = dateStr.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[parseInt(m)-1]} ${parseInt(d)}, ${y}`;
}

export const SECTOR_COLORS: Record<string, string> = {
  'CRAC': '#F59E0B',
  'Air Handling Units': '#3B82F6',
  'Chilled Water System': '#1E293B',
  'Direct Liquid Cooling': '#8B5CF6',
};
