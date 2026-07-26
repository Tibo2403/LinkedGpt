import {
  AnchorHTMLAttributes,
  Children,
  createContext,
  isValidElement,
  MouseEvent,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface RouterContextValue {
  pathname: string;
  navigate: (to: string, replace?: boolean) => void;
}

interface BrowserRouterProps {
  children: ReactNode;
  future?: Record<string, boolean>;
}

interface RouteProps {
  path: string;
  element: ReactNode;
}

interface NavigateProps {
  to: string;
  replace?: boolean;
}

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string;
}

const RouterContext = createContext<RouterContextValue | null>(null);

function useRouter() {
  const router = useContext(RouterContext);
  if (!router) {
    throw new Error('Router components must be rendered inside BrowserRouter.');
  }
  return router;
}

export function BrowserRouter({ children }: BrowserRouterProps) {
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to: string, replace = false) => {
    window.history[replace ? 'replaceState' : 'pushState']({}, '', to);
    setPathname(window.location.pathname);
  }, []);

  const value = useMemo(() => ({ pathname, navigate }), [navigate, pathname]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function Link({ to, onClick, target, ...props }: LinkProps) {
  const { navigate } = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      target === '_blank'
    ) {
      return;
    }

    event.preventDefault();
    navigate(to);
  };

  return <a {...props} href={to} target={target} onClick={handleClick} />;
}

export function Routes({ children }: { children: ReactNode }) {
  const { pathname } = useRouter();
  const routes = Children.toArray(children).filter(
    (child): child is ReactElement<RouteProps> => isValidElement<RouteProps>(child),
  );
  const match = routes.find((route) => route.props.path === pathname)
    ?? routes.find((route) => route.props.path === '*');

  return match?.props.element ?? null;
}

export function Route(props: RouteProps) {
  void props;
  return null;
}

export function Navigate({ to, replace = false }: NavigateProps) {
  const { navigate } = useRouter();

  useEffect(() => {
    navigate(to, replace);
  }, [navigate, replace, to]);

  return null;
}
