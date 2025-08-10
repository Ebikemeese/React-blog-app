import BlogCard from "./BlogCard";
import Spinner from "./Spinner";

const BlogContainer = ({ isPending, blogs = [], title = "🍔Latest Posts" }) => {
  if (isPending) {
    return <Spinner />;
  }

  if (!Array.isArray(blogs)) {
    console.error("Expected an array, but got:", blogs);
    return (
      <section className="padding-x py-6 max-container">
        <h2 className="font-semibold text-xl mb-6 dark:text-white text-center">
          {title}
        </h2>
        <p className="text-center text-red-500">Oops! Blogs data is malformed.</p>
      </section>
    );
  }

  if (blogs.length === 0) {
    return (
      <section className="padding-x py-6 max-container">
        <h2 className="font-semibold text-xl mb-6 dark:text-white text-center">
          {title}
        </h2>
        <p className="text-center text-gray-500">No blog posts available right now.</p>
      </section>
    );
  }

  return (
    <section className="padding-x py-6 max-container">
      <h2 className="font-semibold text-xl mb-6 dark:text-white text-center">
        {title}
      </h2>
      <div className="flex items-center gap-6 justify-center flex-wrap">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </section>
  );
};

export default BlogContainer;
