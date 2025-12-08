import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faUsers, faClipboardList, faBuilding, faFileInvoice, faCircle, faBan, faCheckCircle, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import '../styles/Sidebar.css';

const Sidebar = ({ onNavigate }) => {
  const [expandedSections, setExpandedSections] = useState({
    services: true,
    invoices: true,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleAll = () => {
    const anyOpen = expandedSections.services || expandedSections.invoices;
    setExpandedSections({ services: !anyOpen, invoices: !anyOpen });
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">K</div>
        <div className="user-info" onClick={toggleAll}>
          <div>
            <div className="user-name">Anurag Yadav</div>
            <div className="user-role">Admin</div>
          </div>
          <div className="dropdown-arrow">▼</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-item active" onClick={() => onNavigate?.('dashboard')}>
            <span className="nav-icon"><FontAwesomeIcon icon={faChartBar} /></span>
            <span>Dashboard</span>
          </div>
          <div className="nav-item" onClick={() => onNavigate?.('nexus')}>
            <span className="nav-icon"><FontAwesomeIcon icon={faUsers} /></span>
            <span>Nexus</span>
          </div>
          <div className="nav-item" onClick={() => onNavigate?.('intake')}>
            <span className="nav-icon"><FontAwesomeIcon icon={faClipboardList} /></span>
            <span>Intake</span>
          </div>
        </div>

        <div className={`nav-section ${expandedSections.services ? 'open' : ''}`}>
          <div className="nav-item collapsible" onClick={() => toggleSection('services')}>
            <span className="nav-icon"><FontAwesomeIcon icon={faBuilding} /></span>
            <span>Services</span>
            <span className={`collapse-arrow ${expandedSections.services ? 'expanded' : ''}`}><FontAwesomeIcon icon={faChevronRight} /></span>
          </div>
          <div className="sub-nav" aria-hidden={!expandedSections.services}>
            <div className="sub-nav-item" onClick={() => onNavigate?.('services:pre-active')}><FontAwesomeIcon icon={faCircle} /> Pre-active</div>
            <div className="sub-nav-item" onClick={() => onNavigate?.('services:active')}><FontAwesomeIcon icon={faFileInvoice} /> Active</div>
            <div className="sub-nav-item" onClick={() => onNavigate?.('services:blocked')}><FontAwesomeIcon icon={faBan} /> Blocked</div>
            <div className="sub-nav-item" onClick={() => onNavigate?.('services:closed')}><FontAwesomeIcon icon={faCheckCircle} /> Closed</div>
          </div>
        </div>

        <div className={`nav-section ${expandedSections.invoices ? 'open' : ''}`}>
          <div className="nav-item collapsible" onClick={() => toggleSection('invoices')}>
            <span className="nav-icon"><FontAwesomeIcon icon={faFileInvoice} /></span>
            <span>Invoices</span>
            <span className={`collapse-arrow ${expandedSections.invoices ? 'expanded' : ''}`}><FontAwesomeIcon icon={faChevronRight} /></span>
          </div>
          <div className="sub-nav" aria-hidden={!expandedSections.invoices}>
            <div className="sub-nav-item" onClick={() => onNavigate?.('invoices:proforma')}><FontAwesomeIcon icon={faFileInvoice} /> Proforma Invoices</div>
            <div className="sub-nav-item" onClick={() => onNavigate?.('invoices:final')}><FontAwesomeIcon icon={faFileInvoice} /> Final Invoices</div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
