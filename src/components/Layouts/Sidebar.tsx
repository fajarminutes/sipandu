import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import AnimateHeight from 'react-animate-height';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../../store/themeConfigSlice';
import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard';
import IconMenuChat from '../Icon/Menu/IconMenuChat';
import IconMenuNotes from '../Icon/Menu/IconMenuNotes';
import IconMenuWidgets from '../Icon/Menu/IconMenuWidgets';
import IconMenuUsers from '../Icon/Menu/IconMenuUsers';
import IconCaretDown from '../Icon/IconCaretDown';
import IconMinus from '../Icon/IconMinus';

const Sidebar = () => {
  const [currentMenu, setCurrentMenu] = useState<string>('');
  const themeConfig = useSelector((state: any) => state.themeConfig);
  const semidark = useSelector((state: any) => state.themeConfig.semidark);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const toggleMenu = (value: string) => {
    setCurrentMenu((oldValue) => (oldValue === value ? '' : value));
  };

  useEffect(() => {
    const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
    if (selector) {
      selector.classList.add('active');
      const ul: any = selector.closest('ul.sub-menu');
      if (ul) {
        let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
        if (ele.length) {
          ele = ele[0];
          setTimeout(() => {
            ele.click();
          });
        }
      }
    }
  }, []);

  return (
    <div className={semidark ? 'dark' : ''}>
      <nav
        className={`sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300 ${
          semidark ? 'text-white-dark' : ''
        }`}
      >
        <div className="bg-white dark:bg-black h-full">
          <div className="flex justify-between items-center px-4 py-3">
            <NavLink to="/" className="main-logo flex items-center shrink-0">
              <img className="w-8 ml-[5px] flex-none" src="/assets/images/logo.svg" alt="logo" />
              <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5 font-semibold align-middle lg:inline dark:text-white-light">
                {t('VRISTO')}
              </span>
            </NavLink>
          </div>

          <PerfectScrollbar className="h-[calc(100vh-80px)] relative">
            <ul className="relative font-semibold space-y-0.5 p-4 py-0">
              {/* Dashboard */}
              <li className="nav-item">
                <NavLink to="/dashboard" className="nav-link group">
                  <div className="flex items-center">
                    <IconMenuDashboard className="group-hover:!text-primary shrink-0" />
                    <span className="ltr:pl-3 rtl:pr-3">{t('Dashboard')}</span>
                  </div>
                </NavLink>
              </li>

              {/* Konten Section */}
              <h2 className="py-3 px-7 flex items-center uppercase font-extrabold bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">
                <IconMinus className="w-4 h-5 flex-none hidden" />
                <span>{t('Konten')}</span>
              </h2>

              {/* Beranda */}
              <li className="menu nav-item">
                <button
                  type="button"
                  className={`${currentMenu === 'master-data' ? 'active' : ''} nav-link group w-full`}
                  onClick={() => toggleMenu('master-data')}
                >
                  <div className="flex items-center">
                    <IconMenuChat className="group-hover:!text-primary shrink-0" />
                    <span className="ltr:pl-3 rtl:pr-3">{t('Master Data')}</span>
                  </div>
                  <IconCaretDown />
                </button>
                <AnimateHeight duration={300} height={currentMenu === 'master-data' ? 'auto' : 0}>
                  <ul className="sub-menu text-gray-500">
                    <li><NavLink to="/master-data/karyawan">{t('Data Pegawai')}</NavLink></li>
                    <li><NavLink to="/master-data/jabatan">{t('Data Jabatan')}</NavLink></li>
                    <li><NavLink to="/master-data/shift">{t('Data Jam Kerja')}</NavLink></li>
                    <li><NavLink to="/master-data/lokasi">{t('Data Lokasi')}</NavLink></li>
                    <li><NavLink to="/master-data/thema-card">{t('Tema ID Card')}</NavLink></li>
                    
                  </ul>
                </AnimateHeight>
              </li>

              {/* Profil */}
              <li className="menu nav-item">
                <button
                  type="button"
                  className={`${currentMenu === 'profil' ? 'active' : ''} nav-link group w-full`}
                  onClick={() => toggleMenu('profil')}
                >
                  <div className="flex items-center">
                    <IconMenuNotes className="group-hover:!text-primary shrink-0" />
                    <span className="ltr:pl-3 rtl:pr-3">{t('Profil')}</span>
                  </div>
                  <IconCaretDown />
                </button>
                <AnimateHeight duration={300} height={currentMenu === 'profil' ? 'auto' : 0}>
                  <ul className="sub-menu text-gray-500">
                    <li><NavLink to="/profil/sejarah">{t('Sejarah')}</NavLink></li>
                    <li><NavLink to="/profil/sambutan">{t('Sambutan')}</NavLink></li>
                    <li><NavLink to="/profil/visimisi">{t('Visi Misi')}</NavLink></li>
                    <li><NavLink to="/profil/tujuan">{t('Tujuan')}</NavLink></li>
                    <li><NavLink to="/profil/organisasi">{t('Organisasi')}</NavLink></li>
                    <li><NavLink to="/profil/kurikulum">{t('Kurikulum')}</NavLink></li>
                  </ul>
                </AnimateHeight>
              </li>

              {/* Program */}
              <li className="menu nav-item">
                <button
                  type="button"
                  className={`${currentMenu === 'program' ? 'active' : ''} nav-link group w-full`}
                  onClick={() => toggleMenu('program')}
                >
                  <div className="flex items-center">
                    <IconMenuWidgets className="group-hover:!text-primary shrink-0" />
                    <span className="ltr:pl-3 rtl:pr-3">{t('Program')}</span>
                  </div>
                  <IconCaretDown />
                </button>
                <AnimateHeight duration={300} height={currentMenu === 'program' ? 'auto' : 0}>
                  <ul className="sub-menu text-gray-500">
                    <li><NavLink to="/program/daftar">{t('Daftar')}</NavLink></li>
                    <li><NavLink to="/program/fasilitas">{t('Fasilitas')}</NavLink></li>
                    <li><NavLink to="/program/sambutan">{t('Sambutan')}</NavLink></li>
                    <li><NavLink to="/program/banner">{t('Banner')}</NavLink></li>
                    <li><NavLink to="/program/kerjasama">{t('Kerjasama')}</NavLink></li>
                    <li><NavLink to="/program/tentang">{t('Tentang')}</NavLink></li>
                    <li><NavLink to="/program/kompetensi">{t('Kompetensi')}</NavLink></li>
                  </ul>
                </AnimateHeight>
              </li>

              {/* Blog */}
              <li className="menu nav-item">
                <button
                  type="button"
                  className={`${currentMenu === 'blog' ? 'active' : ''} nav-link group w-full`}
                  onClick={() => toggleMenu('blog')}
                >
                  <div className="flex items-center">
                    <IconMenuNotes className="group-hover:!text-primary shrink-0" />
                    <span className="ltr:pl-3 rtl:pr-3">{t('Blog')}</span>
                  </div>
                  <IconCaretDown />
                </button>
                <AnimateHeight duration={300} height={currentMenu === 'blog' ? 'auto' : 0}>
                  <ul className="sub-menu text-gray-500">
                    <li><NavLink to="/blog/postingan">{t('Postingan')}</NavLink></li>
                    <li><NavLink to="/blog/kategori">{t('Kategori')}</NavLink></li>
                  </ul>
                </AnimateHeight>
              </li>

              {/* Galeri */}
              <li className="nav-item">
                <NavLink to="/galeri" className="nav-link group">
                  <div className="flex items-center">
                    <IconMenuWidgets className="group-hover:!text-primary shrink-0" />
                    <span className="ltr:pl-3 rtl:pr-3">{t('Galeri')}</span>
                  </div>
                </NavLink>
              </li>

              {/* Kelola Website Section */}
              <h2 className="py-3 px-7 flex items-center uppercase font-extrabold bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">
                <IconMinus className="w-4 h-5 flex-none hidden" />
                <span>{t('Kelola Website')}</span>
              </h2>

              {/* Eksternal Link */}
              <li className="nav-item">
                <NavLink to="/eksternallink" className="nav-link group">
                  <div className="flex items-center">
                    <IconMenuNotes className="group-hover:!text-primary shrink-0" />
                    <span className="ltr:pl-3 rtl:pr-3">{t('Eksternal Link')}</span>
                  </div>
                </NavLink>
              </li>

              {/* Pengguna */}
              <li className="nav-item">
                <NavLink to="/pengguna" className="nav-link group">
                  <div className="flex items-center">
                    <IconMenuUsers className="group-hover:!text-primary shrink-0" />
                    <span className="ltr:pl-3 rtl:pr-3">{t('Pengguna')}</span>
                  </div>
                </NavLink>
              </li>
            </ul>
          </PerfectScrollbar>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
