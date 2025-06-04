import { AiFillStar, AiOutlineStar } from "react-icons/ai"

const StarRating = ({ rating }) => {
  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0

  for (let i = 0; i < fullStars; i++) {
    stars.push(<AiFillStar key={i} style={{ color: "#ffd700" }} />)
  }

  if (hasHalfStar) {
    stars.push(<AiFillStar key="half" style={{ color: "#ffd700" }} />)
  }

  const emptyStars = 5 - Math.ceil(rating)
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<AiOutlineStar key={`empty-${i}`} style={{ color: "#ddd" }} />)
  }

  return <div style={{ display: "flex", gap: "2px" }}>{stars}</div>
}

export default StarRating