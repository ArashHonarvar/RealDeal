import { ReactComponent as Art } from "../Assets/icons/art.svg";
import { ReactComponent as Books } from "../Assets/icons/books.svg";
import { ReactComponent as Food } from "../Assets/icons/food.svg";
import { ReactComponent as Movies } from "../Assets/icons/movies.svg";
import { ReactComponent as Music } from "../Assets/icons/music.svg";
import { ReactComponent as Nature } from "../Assets/icons/nature.svg";
import { ReactComponent as Sports } from "../Assets/icons/sports.svg";
import { ReactComponent as Theatre } from "../Assets/icons/theatre.svg";
import { ReactComponent as Travel } from "../Assets/icons/travel.svg";
import { ReactComponent as Videogames } from "../Assets/icons/videogames.svg";

function InterestIcon(props) {

    if (props.interestName === "art")
        return <Art className={props.className} />
    else if (props.interestName === "books")
        return <Books className={props.className} />
    else if (props.interestName === "food")
        return <Food className={props.className} />
    else if (props.interestName === "movies")
        return <Movies className={props.className} />
    else if (props.interestName === "music")
        return <Music className={props.className} />
    else if (props.interestName === "nature")
        return <Nature className={props.className} />
    else if (props.interestName === "sports")
        return <Sports className={props.className} />
    else if (props.interestName === "theatre")
        return <Theatre className={props.className} />
    else if (props.interestName === "travel")
        return <Travel className={props.className} />
    else if (props.interestName === "videogames")
        return <Videogames className={props.className} />
};

export { InterestIcon };