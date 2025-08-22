/**
 * Main component - Container wrapper for main content area
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render in main area
 * @returns {JSX.Element} Main container element
 */
export default function Main({ children }) {
  return <main className="main">{children}</main>;
}
