import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {formatDistance, parseISO} from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const formatDistanceFromNow = (dateStr: string) => formatDistance(parseISO(dateStr), new Date(), {addSuffix: true,}).replace('about ', '').replace('in', 'In');