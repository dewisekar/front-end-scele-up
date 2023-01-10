import React from 'react'
import LoadingGif from '../assets/images/loading.gif'
import styles from './LoadingAnimation.styles'

const LoadingAnimation = () => {
  return (
    <div style={styles.container}>
      <img style={styles.image} src={LoadingGif} alt="slide 2" />
    </div>
  )
}

export default React.memo(LoadingAnimation)
