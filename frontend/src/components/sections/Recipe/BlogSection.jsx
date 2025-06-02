import React from "react";
import NavigateButton from "../../common/NavigateButton";

const BlogSection = ({ blogs }) => {
  if (!blogs || blogs.length === 0) {
    return <div>Không có tin tức nào</div>;
  }

  const mainBlog = blogs[0];
  const sideBogs = blogs.slice(1, 4);

  return (
    <div className="container mx-auto  px-[80px]">
      <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-black mb-6">
        Tin tức - kiến thức
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-6">
        {/* Main blog post */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col hover:-translate-y-2 transition-transform ease-out duration-500 h-[35em]">
          <img
            src={mainBlog.image}
            alt={mainBlog.title}
            className="flex-grow w-full h-48 md:h-56 lg:h-72 object-cover"
          />
          <div className="p-4">
            <h4 className="text-lg md:text-xl lg:text-2xl font-semibold mb-2 line-clamp-2">
              {mainBlog.title}
            </h4>
            <p className="text-gray-600 mb-4 text-sm md:text-base line-clamp-3">
              {mainBlog.excerpt}
            </p>
            <div className="flex items-center space-x-3 mt-auto">
              <img
                src={mainBlog.author.avatar}
                alt={mainBlog.author.name}
                className="rounded-full w-8 h-8"
              />
              <p className="font-medium text-sm">{mainBlog.author.name}</p>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <p className="text-gray-500 text-xs">
                {new Date(mainBlog.publishedAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>
        </div>

        {/* Side blog posts */}
        <div className="grid grid-rows-3 gap-3  h-[35em]">
          {sideBogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-lg shadow overflow-hidden flex items-center hover:-translate-y-1 transition-transform ease-out duration-500"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-1/3 h-full object-cover"
              />

              <div className="p-3 flex-1 flex items-center">
                <p className="font-bold text-sm md:text-base line-clamp-2">
                  {blog.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <NavigateButton />
    </div>
  );
};

export default BlogSection;
