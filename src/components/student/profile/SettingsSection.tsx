import { Card } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Settings } from 'lucide-react'

export function SettingsSection({ email, fullName }: { email: string, fullName: string }) {
  // Tách họ và tên để hiển thị demo
  const splitName = fullName.split(' ');
  const lastName = splitName[0] || '';
  const firstName = splitName.slice(1).join(' ') || '';

  return (
    <Card className="p-8 bg-white shadow-sm border-slate-200 rounded-2xl">
      <h3 className="font-bold text-xl mb-8 flex items-center gap-2 text-slate-900">
        <Settings className="h-6 w-6 text-sky-500" />
        Cài đặt tài khoản
      </h3>
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h4 className="text-sm font-bold uppercase text-slate-500 tracking-wider">Thông tin cá nhân</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Họ</label>
              <Input defaultValue={lastName} className="bg-slate-50 border-slate-200 focus:border-sky-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Tên</label>
              <Input defaultValue={firstName} className="bg-slate-50 border-slate-200 focus:border-sky-500" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <Input defaultValue={email} readOnly className="bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed" />
          </div>
          <Button className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">Lưu thay đổi</Button>
        </div>

        <div className="space-y-6">
          <h4 className="text-sm font-bold uppercase text-slate-500 tracking-wider">Bảo mật & Thông báo</h4>
          <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <p className="text-sm font-bold text-slate-900">Mật khẩu</p>
              <p className="text-xs text-slate-500">Đổi 3 tháng trước</p>
            </div>
            <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 hover:bg-white">Đổi mật khẩu</Button>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3">
              <input type="checkbox" id="email-notif" className="mt-1 h-4 w-4 text-sky-500 rounded border-slate-300 focus:ring-sky-500" defaultChecked />
              <label htmlFor="email-notif">
                <p className="text-sm font-bold text-slate-900">Thông báo qua Email</p>
                <p className="text-xs text-slate-500">Nhận cập nhật về khóa học và bài kiểm tra</p>
              </label>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}