import { Metadata } from 'next';
import ErrorPage from '../../components/ErrorPage';
import { errorMetadata } from '../../utils/errorMetadata';

export const metadata: Metadata = errorMetadata.offline;

export default function OfflinePage() {
  return <ErrorPage type='offline' />;
}
