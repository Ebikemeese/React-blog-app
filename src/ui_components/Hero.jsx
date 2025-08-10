import pic from "../images/pic.jpg";
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { HiPencilAlt } from "react-icons/hi";
import { MdDelete } from "react-icons/md";

const Hero = ({ userInfo, authUsername, toggleModal }) => {
  const {
    first_name,
    last_name,
    job_title,
    bio,
    profile_picture,
    instagram,
    facebook,
    twitter,
    youtube,
  } = userInfo || {};

  return (
    <>
    <div className="padding-x py-9 max-container flex flex-col items-center justify-center gap-4 bg-[#F6F6F7] dark:bg-[#242535] rounded-md">
      {/* Profile Image and Name */}
      <div className="flex gap-4 items-center">
        <div className="w-[70px] h-[70px] rounded-full overflow-hidden">
          <img
            src={profile_picture || pic}
            alt={`${first_name} ${last_name}`}
            className="w-[70px] h-[70px] rounded-full object-cover"
          />
        </div>

        <span>
          <p className="text-[18px] text-[#181A2A] dark:text-white">
            {first_name} {last_name}
          </p>
          <p className="text-[14px] text-[#696A75] font-thin dark:text-[#BABABF]">
            {job_title || "Contributor"}
          </p>
        </span>

        {
          userInfo?.username === authUsername &&
          <span>
            <HiPencilAlt className="dark:text-white text-3xl cursor-pointer" onClick={toggleModal} />
          </span>
        }

      </div>

      {/* Bio */}
      <p className="text-[#3B3C4A] text-[16px] max-md:leading-[2rem] lg:leading-normal lg:mx-[200px] text-center dark:text-[#BABABF]">
        {bio ||
          "This user hasn't added a bio yet. Stay tuned for more updates!"}
      </p>

      {/* Social Links */}
      <div className="flex gap-4 justify-center items-center text-white text-xl">
        {instagram && (
          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="w-[40px] h-[40px] rounded-lg bg-[#696A75] flex justify-center items-center"
          >
            <FaInstagram />
          </a>
        )}
        {facebook && (
          <a
            href={facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="w-[40px] h-[40px] rounded-lg bg-[#696A75] flex justify-center items-center"
          >
            <FaFacebookF />
          </a>
        )}
        {twitter && (
          <a
            href={twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="w-[40px] h-[40px] rounded-lg bg-[#696A75] flex justify-center items-center"
          >
            <BsTwitterX />
          </a>
        )}
        {youtube && (
          <a
            href={youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="w-[40px] h-[40px] rounded-lg bg-[#696A75] flex justify-center items-center"
          >
            <FaYoutube />
          </a>
        )}
      </div>
    </div>
    </>
  );
};

export default Hero;
