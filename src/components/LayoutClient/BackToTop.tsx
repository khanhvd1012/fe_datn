import { useEffect, useState } from 'react';
import { UpOutlined } from '@ant-design/icons';

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200); // Hiện khi cuộn quá 200px
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    visible && (
      <div
        onClick={scrollToTop}
        style={{
          position: 'fixed',
          right: 20,
          bottom: 90,
          width: 60,
          height: 60,
          borderRadius: '50%',
          backgroundColor: 'white',
          color: 'black',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 1000,
        }}
      >
        <UpOutlined />
      </div>
    )
  );
};

export default BackToTop;
