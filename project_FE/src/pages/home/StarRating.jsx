import { IoStar, IoStarOutline, IoStarHalf } from 'react-icons/io5'

const StarRating = ({ rating }) => {
  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0

  for (let i = 0; i < fullStars; i++) {
    stars.push(<IoStar key={i} style={{ color: "#5641b8", fontSize: "1.8rem", marginRight: "3px" }} />)
  }

  if (hasHalfStar) {
    stars.push(<IoStarHalf key="half" style={{ color: "#5641b8", fontSize: "1.8rem", marginRight: "3px" }} />)
  }

  const emptyStars = 5 - Math.ceil(rating)
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<IoStarOutline key={`empty-${i}`} style={{ color: "#ddd", fontSize: "1.8rem", marginRight: "3px" }} />)
  }

  return <div style={{ display: "flex", gap: "2px" }}>{stars}</div>
}

export default StarRating