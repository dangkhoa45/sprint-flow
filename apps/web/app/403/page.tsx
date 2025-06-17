import { Metadata } from 'next';
import ErrorPage from '../../components/ErrorPage';
import { errorMetadata } from '../../utils/errorMetadata';

export const metadata: Metadata = errorMetadata[403];

export default function ForbiddenPage() {
  return <ErrorPage type="403" />;
}
