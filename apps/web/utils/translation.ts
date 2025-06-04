import { MotorbikeStatus } from "../types/motorbike";
import { NewStatus } from "../types/news";
import { OrderStatus, OrderType } from "../types/order";
import { PromotionStatus, PromotionType } from "../types/promotions";
import { ServiceStatus } from "../types/services";
import { UserStatus } from "../types/user";

export const statusLabels: Record<MotorbikeStatus, string> = {
  [MotorbikeStatus.Available]: "Còn hàng",
  [MotorbikeStatus.Sold]: "Đã bán",
  [MotorbikeStatus.Rented]: "Đã cho thuê",
  [MotorbikeStatus.Maintenance]: "Đang bảo trì",
  [MotorbikeStatus.Registered]: "Đã đăng ký",
};

export const serviceStatusLabels: Record<ServiceStatus, string> = {
  [ServiceStatus.Active]: 'Hoạt động',
  [ServiceStatus.Inactive]: 'Không hoạt động',
};

export const userStatusLabels: Record<UserStatus, string> = {
  [UserStatus.Active]: 'Hoạt động',
  [UserStatus.Banned]: 'Bị cấm',
  [UserStatus.Deleted]: 'Đã xóa',
  [UserStatus.Pending]: 'Đang chờ',
};

export const newStatusLabels: Record<NewStatus, string> = {
  [NewStatus.Export]: 'Xuất bản',
  [NewStatus.Hide]: 'Ẩn',
};

export const promotionStatusLabels: Record<PromotionStatus, string> = {
  [PromotionStatus.Active]: 'Hoạt động',
  [PromotionStatus.Inactive]: 'Không hoạt động',
};

export const promotionTypeLabel: Record<PromotionType, string> = {
  [PromotionType.Fixed]: 'Giảm giá cố định',
  [PromotionType.Percentage]: 'Giảm giá theo phần trăm',
};

export const orderStatusLabels: Record<OrderStatus, string> = {
  [OrderStatus.Request]: 'Đang yêu cầu',           
  [OrderStatus.Scheduled]: 'Đặt lịch hẹn',           
  [OrderStatus.UserConfirmed]: 'Người dùng đã xác nhận', 
  [OrderStatus.Completed]: 'Đã hoàn thành',         
  [OrderStatus.Returned]: 'Đã trả lại',             
  [OrderStatus.Available]: 'Có sẵn',                
};

export const orderTypeLabels: Record<OrderType, string> = {
  [OrderType.Sale]: 'Mua xe',
  [OrderType.Rent]: 'Thuê xe',
};

