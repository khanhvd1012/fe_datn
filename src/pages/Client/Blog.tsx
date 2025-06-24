import React from 'react';
import Breadcrumb from '../../components/LayoutClient/Breadcrumb';
import SidebarMenu from '../../components/LayoutClient/SideBarMenu';

const blogPosts = [
  {
    title: 'Adidas Falcon nổi bật mùa Hè với phối màu color block',
    author: 'Nguyen',
    date: '11.06.2019',
    image: 'https://picsum.photos/id/21/480/280',
    desc: 'Cuối tháng 5, adidas Falcon đã cho ra mắt nhiều phối màu đón chào mùa Hè khiến giới trẻ yêu thích không thôi...'
  },
  {
    title: 'Saucony hồi sinh mẫu giày chạy bộ cổ điển – Aya Runner',
    author: 'Nguyen',
    date: '11.06.2019',
    image: 'https://picsum.photos/id/28/480/280',
    desc: 'Là một trong những đôi giày chạy bộ tốt nhất vào những năm 1994, 1995, Saucony Aya Runner vừa có màn trở lại...'
  },
  {
    title: 'Nike Vapormax Plus trở lại với sắc tím mộng mơ',
    author: 'Runner Inn',
    date: '11.06.2019',
    image: 'https://picsum.photos/id/28/480/280',
    desc: 'Nike Vapormax Plus là mẫu retro có nhiều phối màu gradient đẹp mắt từ trước đến nay...'
  }
];

const Blog = () => {
  return (
    <>
      <Breadcrumb current="Tin tức" />
    <div className="px-6 py-4 font-[Quicksand]">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-1/3">
          <h4 className="text-lg font-semibold mb-4">Bài viết mới nhất</h4>
          {blogPosts.map((post, index) => (
            <div key={index} className="flex gap-3 mb-4">
              <img src={post.image} alt={post.title} className="w-20 h-16 object-cover rounded" />
              <div>
                <p className="text-sm font-medium leading-tight">{post.title}</p>
                <span className="text-xs text-gray-500">{post.author} - {post.date}</span>
              </div>
            </div>
          ))}
          <SidebarMenu />
        </aside>

        {/* Main Blog Posts */}
        <main className="w-full md:w-2/3">
          {blogPosts.map((post, index) => (
            <div key={index} className="mb-8 border-b pb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <img src={post.image} alt={post.title} className="w-full md:w-2/5 rounded-md object-cover" />
                <div className="flex-1">
                  <h5 className="text-lg font-semibold mb-1">{post.title}</h5>
                  <span className="text-sm text-gray-500">Người viết: {post.author} / {post.date}</span>
                  <p className="mt-2 text-sm text-gray-700">{post.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
    </>
  );
};

export default Blog;
