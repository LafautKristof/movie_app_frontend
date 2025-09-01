import { IconType } from "react-icons";
import {
    FaGun,
    FaRegCompass,
    FaChildren,
    FaRegFaceLaughSquint,
    FaFingerprint,
    FaPhotoFilm,
    FaRegFaceSadCry,
    FaWandMagicSparkles,
    FaScroll,
    FaGhost,
    FaMusic,
    FaMagnifyingGlass,
    FaHeart,
    FaHorse,
} from "react-icons/fa6";
import { MdOutlineFamilyRestroom } from "react-icons/md";
import { SiAlienware } from "react-icons/si";
import { PiTelevisionDuotone } from "react-icons/pi";
import { IoWarningSharp } from "react-icons/io5";
import { GiSentryGun } from "react-icons/gi";

export const genreIcons: Record<number, IconType> = {
    28: FaGun, // Action
    12: FaRegCompass, // Adventure
    16: FaChildren, // Animation
    35: FaRegFaceLaughSquint, // Comedy
    80: FaFingerprint, // Crime
    99: FaPhotoFilm, // Documentary
    18: FaRegFaceSadCry, // Drama
    10751: MdOutlineFamilyRestroom, // Family
    14: FaWandMagicSparkles, // Fantasy
    36: FaScroll, // History
    27: FaGhost, // Horror
    10402: FaMusic, // Music
    9648: FaMagnifyingGlass, // Mystery
    10749: FaHeart, // Romance
    878: SiAlienware, // Science Fiction
    10770: PiTelevisionDuotone, // TV Movie
    53: IoWarningSharp, // Thriller
    10752: GiSentryGun, // War
    37: FaHorse, // Western
};
export const genreMap: Record<number, string> = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
};

export const genreColors: Record<string, string> = {
    Action: "bg-red-600",
    Adventure: "bg-green-600",
    Animation: "bg-pink-600",
    Comedy: "bg-yellow-500 text-black",
    Crime: "bg-gray-700",
    Documentary: "bg-blue-400 text-black",
    Drama: "bg-purple-600",
    Family: "bg-orange-500 text-black",
    Fantasy: "bg-indigo-500",
    History: "bg-stone-500",
    Horror: "bg-black",
    Music: "bg-rose-400 text-black",
    Mystery: "bg-teal-600",
    Romance: "bg-pink-500",
    "Science Fiction": "bg-cyan-500 text-black",
    "TV Movie": "bg-slate-500",
    Thriller: "bg-red-800",
    War: "bg-amber-700",
    Western: "bg-yellow-700",
};
