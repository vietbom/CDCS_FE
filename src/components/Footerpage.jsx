import React from 'react';

const FooterPage = () => { 
  return (
    <footer className='bg-green-300 border-t mt-auto pt-12 pb-8 px-4 sm:px-6 lg:px-8 text-gray-800'> {/* Thêm text-gray-800 mặc định cho footer */}
      <div className='container mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'> {/* Tăng gap một chút nếu muốn */}

          <div>
            <h4 className='text-base font-semibold text-gray-900 mb-4'>
              Học Viện Kỹ thuật Mật mã - KMA
            </h4>
            <p className='text-sm'> 
              Academy of Cryptography Techniques (ACT)
            </p>
            <p className='text-sm mt-2'>
              141 Chiến Thắng, Tân Triều, Thanh Trì, Hà Nội
            </p>
            <p className='text-sm mt-1'>
              Website: <a href="https://actvn.edu.vn" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 hover:underline">actvn.edu.vn</a>
            </p>
          </div>

          <div>
            <h4 className='text-base font-semibold text-gray-900 mb-4'>
              Thông tin
            </h4>
            <ul className='space-y-2 text-sm'>
              <li><a href="/function" className="hover:text-gray-900 hover:underline">Chức năng & Nhiệm vụ</a></li>
              <li><a href="/intro" className="hover:text-gray-900 hover:underline">Giới thiệu</a></li>
            </ul>
          </div>

          <div>
            <h4 className='text-base font-semibold text-gray-900 mb-4'>
              Thành viên Nhóm 76 - CDCS
            </h4>
            <ul className='space-y-1 text-sm'>
              <li>
                Phạm Bảo Giang - <a href="mailto:phambaogiang2k4@gmail.com" className="hover:text-gray-900 hover:underline">phambaogiang2k4@gmail.com</a>
              </li>
              <li>
                Phạm Long Việt - <a href="mailto:phamlongviet3107@gmail.com" className="hover:text-gray-900 hover:underline">phamlongviet3107@gmail.com</a>
              </li>
              <li>
                Nguyễn Đức Việt - <a href="mailto:vietnho2004@gmail.com" className="hover:text-gray-900 hover:underline">vietnho2004@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center text-sm text-gray-700 mt-8 pt-8 border-t border-gray-300">
          © {new Date().getFullYear()} Học Viện Kỹ thuật Mật mã. All rights reserved.
          <br />
          Phát triển bởi Nhóm 76 - CDCS.
        </div>
      </div>
    </footer>
  );
};

export default FooterPage;