import dayjs, { Dayjs, OptionType } from 'dayjs';
import customParseFormatPlugin from 'dayjs/plugin/customParseFormat';
import durationPlugin from 'dayjs/plugin/duration';
import utcPlugin from 'dayjs/plugin/utc';
import { env } from '../environment';

dayjs.extend(customParseFormatPlugin);
dayjs.extend(durationPlugin);
dayjs.extend(utcPlugin);
dayjs().format();

export type Time = Dayjs;

export type Duration = {
  milliseconds?: number
  seconds?: number
  minutes?: number
  hours?: number
  days?: number
  months?: number
  years?: number
  weeks?: number
};

export const getCurrentTime = (): Time => dayjs().utcOffset(env.UTC_OFFSET);

export const parseTime = (
  value: string,
  format: OptionType,
): Time => dayjs(value, format).utcOffset(env.UTC_OFFSET, true);

export const asMilliseconds = (
  duration: Duration,
): number => dayjs.duration(duration).asMilliseconds();
