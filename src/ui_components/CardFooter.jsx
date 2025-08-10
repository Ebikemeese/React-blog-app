import { Link } from "react-router-dom";
import pic from "../images/pic.jpg"
import { FormatDate } from "@/services/formatDate";

const CardFooter = ({ blog }) => {

  return (
    <Link to={`/profile/${blog.author.username}`}>
      <div className="flex items-center gap-4 ">
        <span className="flex items-center gap-2">
          <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
            <img
              src={blog.author.profile_picture ? `${blog.author.profile_picture}` : pic}
              alt={`${blog.author.first_name} ${blog.author.last_name}`}
              className="c rounded-full w-full h-full object-cover"
            />
          </div>

          <small className="text-[#97989F] text-[12px] font-semibold">
            {blog.author.first_name} {blog.author.last_name}
          </small>
        </span>

        <small className="text-[#97989F] text-[12px] font-semibold ml-3">
          {FormatDate(blog.published_time)}
        </small>
      </div>
    </Link>
  );
};

export default CardFooter