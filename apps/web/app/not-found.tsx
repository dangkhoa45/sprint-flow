import { Metadata } from 'next';
import ErrorPage from '../components/ErrorPage';
import { errorMetadata } from '../utils/errorMetadata';

export const metadata: Metadata = errorMetadata[404];

export default function NotFound() {
  return <ErrorPage type='404' />;
}
