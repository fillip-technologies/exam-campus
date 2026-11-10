import Header from '@/components/layout/Header/Header'
import Footer from '@/components/layout/Footer/Footer'
import LoginModal from '@/components/auth/LoginModal'

/** Site chrome shared by every page: skip link, header, main landmark, footer. */
export default function MainLayout({ children }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-md bg-primary-700 px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <LoginModal />
    </>
  )
}
