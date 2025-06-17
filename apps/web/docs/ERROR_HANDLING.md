# Error Handling và Loading System cho SprintFlow

Hệ thống error handling và loading components toàn diện cho ứng dụng Next.js.

## 📁 Cấu trúc File

```
app/
├── error.tsx              # Global error boundary cho app directory
├── global-error.tsx       # Error boundary cho toàn ứng dụng
├── loading.tsx           # Global loading UI
├── not-found.tsx         # 404 page
├── 403/page.tsx          # Forbidden page
├── 500/page.tsx          # Internal server error page
├── offline/page.tsx      # Offline page

components/
├── ErrorBoundary.tsx     # Error boundary component tái sử dụng
├── ErrorPage.tsx         # Template page cho các loại lỗi
├── LoadingComponent.tsx  # Loading component với nhiều variant
├── OfflineDetector.tsx   # Detector và UI cho offline state
├── SafeWrapper.tsx       # Wrapper kết hợp error boundary + loading
├── AppWrapper.tsx        # Wrapper tổng hợp với offline detection

hooks/
├── useErrorHandler.ts    # Hook xử lý lỗi
├── useLoading.ts         # Hook quản lý loading states

utils/
├── errorMetadata.ts      # Metadata cho error pages

lib/
├── error-handling.ts     # Export tất cả components và hooks
```

## 🚀 Cách sử dụng

### 1. Import components

```tsx
import { 
  ErrorBoundary, 
  ErrorPage, 
  LoadingComponent, 
  AppWrapper,
  useErrorHandler, 
  useLoading 
} from '@/lib/error-handling';
```

### 2. Sử dụng Error Boundary

```tsx
// Bọc component cần bảo vệ
<ErrorBoundary
  onError={(error, errorInfo) => {
    console.error('Component error:', error);
    // Có thể gửi lỗi lên error reporting service
  }}
>
  <YourComponent />
</ErrorBoundary>

// Hoặc với custom fallback
<ErrorBoundary
  fallback={<div>Có lỗi xảy ra!</div>}
>
  <YourComponent />
</ErrorBoundary>
```

### 3. Sử dụng Loading Component

```tsx
// Loading cơ bản
<LoadingComponent />

// Loading toàn trang
<LoadingComponent loadingPage={true} />

// Loading với variant khác nhau
<LoadingComponent 
  variant="linear" 
  message="Đang xử lý..." 
  size="large" 
/>

// Các variant: 'circular', 'linear', 'skeleton', 'dots'
```

### 4. Sử dụng Error Page

```tsx
// Trong component
<ErrorPage 
  type="404" 
  title="Trang không tồn tại"
  message="Trang bạn tìm kiếm không có"
/>

// Các type: '404', '403', '500', 'offline', 'general'
```

### 5. Sử dụng AppWrapper (Recommended)

```tsx
// Bọc toàn bộ app hoặc page
<AppWrapper
  enableOfflineDetection={true}
  loadingVariant="circular"
  showLoadingPage={true}
  onError={(error) => console.error(error)}
>
  <YourApp />
</AppWrapper>
```

### 6. Sử dụng Hooks

#### useErrorHandler

```tsx
function MyComponent() {
  const { 
    handleError, 
    clearError, 
    hasError, 
    errorMessage,
    handleHttpError 
  } = useErrorHandler();

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      if (!response.ok) {
        handleHttpError(response.status);
        return;
      }
      // Xử lý data thành công
    } catch (error) {
      handleError(error as Error, 'general');
    }
  };

  if (hasError) {
    return <ErrorPage type="general" message={errorMessage} />;
  }

  return <div>Your content</div>;
}
```

#### useLoading

```tsx
function MyComponent() {
  const { 
    isLoading, 
    setLoading, 
    withLoading, 
    clearAllLoading 
  } = useLoading();

  const fetchData = async () => {
    await withLoading(async () => {
      const response = await fetch('/api/data');
      return response.json();
    }, 'fetchData');
  };

  // Hoặc manual control
  const handleSubmit = async () => {
    setLoading('submit', true);
    try {
      await submitData();
    } finally {
      setLoading('submit', false);
    }
  };

  return (
    <div>
      {isLoading && <LoadingComponent />}
      <button onClick={fetchData}>Fetch Data</button>
    </div>
  );
}
```

## 🔧 Cấu hình Next.js Routes

Hệ thống tự động sử dụng Next.js App Router conventions:

- `app/error.tsx` - Bắt lỗi trong route segments
- `app/global-error.tsx` - Bắt lỗi toàn cục
- `app/loading.tsx` - Loading UI cho route segments  
- `app/not-found.tsx` - 404 page
- `app/[status]/page.tsx` - Các error page cụ thể

## 📱 Offline Detection

```tsx
import { OfflineDetector } from '@/lib/error-handling';

<OfflineDetector>
  <YourApp />
</OfflineDetector>
```

Component sẽ:
- Hiển thị thông báo khi mất kết nối
- Tự động ẩn thông báo khi có kết nối lại
- Cung cấp nút "Thử lại"

## 🎨 Tùy chỉnh UI

Tất cả components đều sử dụng Material-UI và hỗ trợ theme tùy chỉnh:

```tsx
<LoadingComponent 
  variant="dots"
  message="Đang tải dữ liệu..."
  size="large"
/>

<ErrorPage 
  type="500"
  title="Lỗi máy chủ"
  message="Vui lòng thử lại sau"
  showBackButton={true}
  showRefreshButton={true}
/>
```

## 🔍 Debugging

Trong development mode:
- Hiển thị error messages chi tiết
- Console logs cho debugging
- Stack traces trong UI

Trong production mode:
- Ẩn thông tin nhạy cảm
- Chỉ hiển thị user-friendly messages
- Gửi lỗi lên monitoring service

## 🚀 Best Practices

1. **Luôn bọc async operations với error handling**
2. **Sử dụng AppWrapper cho top-level components**
3. **Implement proper loading states**
4. **Handle network errors gracefully**
5. **Provide meaningful error messages**
6. **Test error scenarios**

## 📊 Monitoring

Tích hợp với error reporting services:

```tsx
const { handleError } = useErrorHandler();

// Custom error handler với reporting
const handleErrorWithReporting = (error: Error) => {
  // Gửi lên monitoring service
  errorReportingService.report(error);
  
  // Hiển thị UI error
  handleError(error);
};
```

## 🔄 Migration

Để migrate từ hệ thống cũ:

1. Thay thế loading components cũ bằng `LoadingComponent`
2. Bọc components với `ErrorBoundary` hoặc `AppWrapper`
3. Sử dụng `useErrorHandler` cho async operations
4. Cập nhật error pages sử dụng `ErrorPage`

Hệ thống này cung cấp foundation mạnh mẽ cho error handling và loading states trong ứng dụng Next.js.
