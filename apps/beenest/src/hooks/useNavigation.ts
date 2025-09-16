import { useRouter, useNavigate } from '@tanstack/react-router'

export const useNavigation = () => {
  const router = useRouter()
  const navigate = useNavigate()

  const navigateWithTransition = (to: string) => {
    const mainContent = document.querySelector(".main-content")
    if (mainContent) {
      mainContent.classList.add("opacity-0")
      setTimeout(() => {
        navigate({ to })
        mainContent.classList.remove("opacity-0")
      }, 300)
    } else {
      navigate({ to })
    }
  }

  const getCurrentPath = () => router.state.location.pathname

  const isCurrentPath = (path: string) => getCurrentPath() === path

  return {
    navigate,
    navigateWithTransition,
    getCurrentPath,
    isCurrentPath,
  }
}