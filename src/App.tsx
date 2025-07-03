import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import ProductFilterPage from './pages/ProductFilterPage';
import { BecomeSupplierPage } from './pages/BecomeSupplierPage';
import SupplierAuthPage from './pages/SupplierAuthPage';
import SupplierDashboardPage from './pages/SupplierDashboardPage';
import SupplierProductsPage from './pages/SupplierProductsPage';
import SupplierProfilePage from './pages/SupplierProfilePage';
import AddProductPage from './pages/AddProductPage';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/products/filter/:filterValue" element={<ProductFilterPage />} />
            <Route path="/products/:filterType/:filterValue" element={<ProductFilterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/become-supplier" element={<BecomeSupplierPage />} />
            
            {/* Supplier Authentication */}
            <Route path="/supplier/auth" element={<SupplierAuthPage />} />
            
            {/* Protected Supplier Routes */}
            <Route path="/supplier/dashboard" element={
              <ProtectedRoute>
                <SupplierDashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/supplier/products" element={
              <ProtectedRoute>
                <SupplierProductsPage />
              </ProtectedRoute>
            } />
            <Route path="/supplier/products/add" element={
              <ProtectedRoute>
                <AddProductPage />
              </ProtectedRoute>
            } />
            <Route path="/supplier/profile" element={
              <ProtectedRoute>
                <SupplierProfilePage />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;