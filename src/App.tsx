import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion'
import { HomePage } from './pages/HomePage'

export default function App() {
  return (
    // "user" honours the visitor's reduced-motion setting. `m` components + domAnimation keep the bundle small.
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <HomePage />
      </LazyMotion>
    </MotionConfig>
  )
}
