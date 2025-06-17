import { Metadata } from 'next';
import ErrorPage from '../../components/ErrorPage';
import { errorMetadata } from '../../utils/errorMetadata';

export const metadata: Metadata = errorMetadata[500];

export default function InternalServerError() {
  return <ErrorPage type="500" />;
}
