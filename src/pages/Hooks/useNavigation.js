// hooks/useNavigation.js
import { useNavigate } from 'react-router-dom';

const useNavigation = () => {
  const navigate = useNavigate();

  const goToPage = (path) => {
    navigate(path);
  };

  return { goToPage };
};

export default useNavigation;
