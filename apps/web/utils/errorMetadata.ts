import { Metadata } from 'next';

export function generateErrorMetadata(
  title: string,
  description?: string
): Metadata {
  return {
    title: `${title} | SprintFlow`,
    description: description || 'Trang lỗi SprintFlow',
    robots: {
      index: false,
      follow: false,
    },
  };
}

export const errorMetadata = {
  404: generateErrorMetadata(
    'Không tìm thấy trang',
    'Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.'
  ),
  403: generateErrorMetadata(
    'Truy cập bị từ chối',
    'Bạn không có quyền truy cập vào trang này.'
  ),
  500: generateErrorMetadata(
    'Lỗi máy chủ',
    'Máy chủ đã gặp lỗi nội bộ. Chúng tôi đang khắc phục vấn đề.'
  ),
  offline: generateErrorMetadata(
    'Không có kết nối',
    'Vui lòng kiểm tra kết nối internet của bạn.'
  ),
};
