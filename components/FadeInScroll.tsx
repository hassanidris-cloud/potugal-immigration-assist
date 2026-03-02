import { useEffect } from 'react'
import { useRouter } from 'next/router'

const VISIBLE_CLASS = 'fade-in-visible'
const ATTR = 'data-fade-in'

function isInViewport(el: Element, margin = 80): boolean {
  const rect = el.getBoundingClientRect()
  return rect.top < window.innerHeight + margin && rect.bottom > -margin
}

export default function FadeInScroll() {
  const router = useRouter()

  useEffect(() => {
    let observer: IntersectionObserver | null = null
    let rafId: number

    const run = () => {
      const elements = document.querySelectorAll(`[${ATTR}]`)
      if (elements.length === 0) return

      // Show any element already in (or near) the viewport immediately
      elements.forEach((el) => {
        if (isInViewport(el)) (el as HTMLElement).classList.add(VISIBLE_CLASS)
      })

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add(VISIBLE_CLASS)
            }
          })
        },
        { threshold: 0.05, rootMargin: '0px 0px -60px 0px' }
      )
      elements.forEach((el) => observer!.observe(el))
    }

    // Wait for layout then run; retry once if no elements (for slow/hydrated content)
    const timer = setTimeout(() => {
      run()
      rafId = requestAnimationFrame(() => {
        const again = document.querySelectorAll(`[${ATTR}]`)
        if (again.length > 0 && !observer) run()
      })
    }, 200)

    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(rafId)
      if (observer) observer.disconnect()
    }
  }, [router.asPath])

  return null
}
