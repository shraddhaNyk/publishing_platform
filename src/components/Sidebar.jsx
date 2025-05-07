import React, { useState } from 'react';
import { FaBars, FaSearch, FaBook, FaWallet,FaChalkboardTeacher } from "react-icons/fa";
import { MdGroups, MdGroupAdd } from "react-icons/md";
import { GiNewspaper, GiVideoConference } from "react-icons/gi";
import { GrUserAdmin } from "react-icons/gr";
import { VscAccount } from "react-icons/vsc";
import { VscGitPullRequestNewChanges } from "react-icons/vsc";
import { NavLink } from 'react-router-dom';
import { IoBookSharp } from "react-icons/io5";
import { IoIosHome } from "react-icons/io";

import './Sidebar.css';



const Sidebar = ({ children, currentUser }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showAdminSubMenu, setShowAdminSubMenu] = useState(false);
    const [showCommunitySubMenu, setShowCommunitySubMenu] = useState(false);
    const [showInterestSubMenu, setShowInterestSubMenu] = useState(false);

    const [showRoleManagementSubMenu, setShowRoleManagementSubMenu] = useState(false);
    const [showJournalReviewerSubMenu, setShowJournalReviewerSubMenu] = useState(false);
    const [showBookReviewerSubMenu, setShowBookReviewerSubMenu] = useState(false);
    ///////////////////////////////////
    const [showCourseAdminSubMenu, setShowCourseAdminSubMenu] = useState(false);
    // const [showConferenceAdminSubMenu, setShowConferenceAdminSubMenu] = useState(false);
    //////////////////////////////////////////////////////////////////////////////////////////
    const [showTechnologyandindustryAdminSubMenu, setshowTechnologyandindustryAdminSubMenu] = useState(false);
   
    //////////////////////////////////
    const [showEmployeeManagementSubMenu, setShowEmployeeManagementSubMenu] = useState(false);

    const [showBooksManagementSubMenu, setShowBooksManagementSubMenu] = useState(false);
    const [showJournalManagementSubMenu, setShowJournalManagementSubMenu] = useState(false);
    const [showCorporateEmployeeManagementSubMenu, setShowCorporateEmployeeManagementSubMenu] = useState(false);

    const [showCorporateManagementSubMenu, setShowCorporateManagementSubMenu] = useState(false);
    const [showCorporateBooksManagementSubMenu, setShowCorporateBooksManagementSubMenu] = useState(false);
   const [showICouponManagemnetSubMenu,setshowICouponManagemnetSubMenu]=useState(false);
    
    const [showIJST_approval, setshowIJST_approval] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    const toggleAdminSubMenu = () => setShowAdminSubMenu(!showAdminSubMenu);
    const toggleCommunitySubMenu = () => setShowCommunitySubMenu(!showCommunitySubMenu);
    const toggleInterestSubMenu = () => setShowInterestSubMenu(!showInterestSubMenu);
   

    const toggleRoleManagementSubMenu = () => setShowRoleManagementSubMenu(!showRoleManagementSubMenu);
    const toggleShowJournalReviewerSubMenu = () => setShowJournalReviewerSubMenu(!showJournalReviewerSubMenu);
    const toggleShowBookReviewerSubMenu = () => setShowBookReviewerSubMenu(!showBookReviewerSubMenu);
    const toggleShowCourseAdminSubMenu = () => setShowCourseAdminSubMenu(!showCourseAdminSubMenu);
    // const toggleShowConferenceAdminSubMenu = () => setShowConferenceAdminSubMenu(!showConferenceAdminSubMenu);

    const toggleEmployeeManagementSubMenu = () => setShowEmployeeManagementSubMenu(!showEmployeeManagementSubMenu);
    const toggleBooksManagementSubMenu = () => setShowBooksManagementSubMenu(!showBooksManagementSubMenu);
    const toggleJournalManagementSubMenu = () => setShowJournalManagementSubMenu(!showJournalManagementSubMenu);
    const toggleCorporateEmployeeManagementSubMenu = () => setShowCorporateEmployeeManagementSubMenu(!showCorporateEmployeeManagementSubMenu);

    const toggleCorporateManagementSubMenu = () => setShowCorporateManagementSubMenu(!showCorporateManagementSubMenu);
    
    const toggleCorporateBooksManagementSubMenu = () => setShowCorporateBooksManagementSubMenu(!showCorporateBooksManagementSubMenu);

    const toggleTechnologyandindustrySubMenu = () => setshowTechnologyandindustryAdminSubMenu(!showTechnologyandindustryAdminSubMenu);
    const toggleIJST_approval = () => setshowIJST_approval(!showIJST_approval);
    const toggleCouponManagemnetSubMenu=()=>setshowICouponManagemnetSubMenu(!showICouponManagemnetSubMenu);



    const menuItem = [
        {path: '/Dashboard' , name:'Home',icon:<IoIosHome size={18}/>, submenu: []},
        { path: "/Profile", name: "Profile", icon: <VscAccount />, submenu: [] },
        
        { path: "/Course", name: "Course", icon: <FaChalkboardTeacher  />, submenu: [] },
        { path: "/MyCourses", name: "My Courses", icon: <FaChalkboardTeacher  />, submenu: [] },
        { path: "/RequestRole", name: "Request Role", icon: <VscGitPullRequestNewChanges/> , submenu: [] },
        { path: "/shop", name: "Platform Charges", icon: <MdGroupAdd />, submenu: [] },
        { path: "/Communities", name: "Communities", icon: <MdGroups />, submenu: [] },
        { path: "/journal", name: "Journal", icon: <GiNewspaper />, submenu: [] },
        { path: "/book", name: "Book", icon: <IoBookSharp />, submenu: [] },
       
    ];


    if (currentUser === 'Website Admin') {
        menuItem.unshift({
            name: "Website Admin",
            path: "#",
            icon: <GrUserAdmin />,
            submenu: [
                {
                    name: "User admin",
                    path: "#",
                    toggleSubMenu: toggleRoleManagementSubMenu,
                    showSubMenu: showRoleManagementSubMenu,
                    employeeMenu: [
                        { path: "/pendingApproval", name: "Pending Approval" },
                        { path: "/editRole", name: "Edit Role" },
                        { path: "/deleteUser", name: "Delete User" }
                    ]
                },
                {
                    name: "Coupon Management",
                    path: "#",
                    toggleSubMenu: toggleCouponManagemnetSubMenu,
                    showSubMenu: showICouponManagemnetSubMenu,
                    CouponMenu: [
                        { path: "/CreateCoupons", name: "Create Coupons" },
                    
                    ]
                },
                {
                    name: "IJST Approval",
                    path: "#",
                    toggleSubMenu: toggleIJST_approval,
                    showSubMenu: showIJST_approval,
                    IJSTMenu: [
                        { path: "/PaperApproval", name: "Paper Approval" },

                    ]
                },
                {
                    name: "Community admin",
                    path: "#",
                    toggleSubMenu: toggleCommunitySubMenu,
                    showSubMenu: showCommunitySubMenu,
                    communityMenu: [
                        { path: "/createCommunity", name: "Create Community" },
                        { path: "/updateCommunity", name: "Update Community" },
                        { path: "/deleteCommunity", name: "Delete Community" },
                        { path: "/CommunityStatic", name: "Community Statistic" },
                    ]
                },
                {
                    name: "Interest admin",
                    path: "#",
                    toggleSubMenu: toggleInterestSubMenu,
                    showSubMenu: showInterestSubMenu,
                    interestMenu: [
                        { path: "/createInterest", name: "Create Interest" },
                        { path: "/updateInterest", name: "Update Interest" },
                        { path: "/deleteInterest", name: "Delete Interest" }
                    ]
                },
                {
                    name: "Technology and industry",
                    path: "#",
                    toggleSubMenu: toggleTechnologyandindustrySubMenu,
                    showSubMenu: showTechnologyandindustryAdminSubMenu,
                    TechnologyandindustryMenu: [
                        { path: "/CreatIndustry", name: "Create Industry" },
                        { path: "/UpdateIndustry" , name: "Update Industry "},
                        { path: "/DeleteIndustry" , name: "Delete Industry"},
                        { path: "/CreatTechnology", name: "Create Technology" },
                        { path: "/UpdateTechnology" , name: "Update Technology"},
                        { path: "/DeleteTechnology" , name: "Delete Technology"},

                    ]
                },
                {
                    name: "Courses Admin",
                    path: "#",
                    toggleSubMenu: toggleShowCourseAdminSubMenu,
                    showSubMenu: showCourseAdminSubMenu,
                    bookMenu: [
                        { path: "/CreateCourse", name: "Create Course" },
                        { path: "/UpdateCourse" , name: "Update Course"},
                        { path: "/DeleteCourse" , name: "Delete Course"},
                    ]
                },
                
                {
                    name: "Publisher admin",
                    path: "#",
                    toggleSubMenu: toggleShowJournalReviewerSubMenu,
                    showSubMenu: showJournalReviewerSubMenu,
                    Publishersubmenu: [
                        {
                            name: "Books Management",
                            path: "#",
                            toggleSubMenu: toggleBooksManagementSubMenu,
                            showSubMenu: showBooksManagementSubMenu,
                            PublisherbooksMenu: [
                                { path: "/PublishedBooks", name: "Published Books" },
                                { path: "/ApplicationForReviewer", name: "Books Under Publishing" }
                            ]
                        },
                        {
                            name: "Employee management",
                            path: "#",
                            toggleSubMenu: toggleEmployeeManagementSubMenu,
                            showSubMenu: showEmployeeManagementSubMenu,
                            PublisheremployeeMenu: [
                                { path: "/AddEmp", name: "Add Employee" },
                                { path: "/UpdateEmployee", name: "Update Employee" },
                                { path: "/DeactivateEmp", name: "Deactivate Employee" },
                                { path: "/SearchEmployee", name: "Search Employee" }
                            ]
                        }
                        
                    ]
                },
                {
                    name: "Corporate admin",
                    path: "#",
                    toggleSubMenu: toggleCorporateManagementSubMenu,
                    showSubMenu: showCorporateManagementSubMenu,
                    corporateMenu: [
                        {
                            name: "Employee management",
                            path: "#",
                            toggleSubMenu: toggleCorporateEmployeeManagementSubMenu,
                            showSubMenu: showCorporateEmployeeManagementSubMenu,
                            employeeMenu: [
                                { path: "/AddEmp", name: "Add Employee" },
                                { path: "/UpdateEmployee", name: "Update Employee" },
                                { path: "/DeactivateEmp", name: "Deactivate Employee" },
                                { path: "/SearchEmployee", name: "Search Employee" }
                            ]
                        },
                        {
                            name: "Books Management",
                            path: "#",
                            toggleSubMenu: toggleCorporateBooksManagementSubMenu,
                            showSubMenu: showCorporateBooksManagementSubMenu,
                            booksMenu: [
                                { path: "/PublishedBooks", name: "Published Books" },
                                { path: "/BooksUnderPublishing", name: "Books Under Publishing" },
                                { path: "/SearchBook", name: "Search Book" }
                            ]
                        },
                        {
                            name: "Journal Management",
                            path: "#",
                            toggleSubMenu: toggleJournalManagementSubMenu,
                            showSubMenu: showJournalManagementSubMenu,
                            journalMenu: [
                                { path: "/PublishedJournals", name: "Published Journals" },
                                { path: "/ApplicationForReviewer", name: "Journals Under Review" },
                                { path: "/SearchJournals", name: "Search Journals" }
                            ]
                        }
                    ]
                }
            ]
        });

    }else if (currentUser === 'User admin') {
        menuItem.unshift({
            name: "User admin ",
            path: "#",
            toggleSubMenu: toggleRoleManagementSubMenu,
            showSubMenu: showRoleManagementSubMenu,
            nestedSubMenu: [
                { path: "/pendingApproval", name: "Pending Approval" },
                { path: "/editRole", name: "Edit Role" },
                { path: "/deleteUser", name: "Delete User" }
            ]
        });
    } else if (currentUser === 'Community admin') {
        menuItem.unshift({
            name: "Community admin",
            path: "#",
            toggleSubMenu: toggleCommunitySubMenu,
            showSubMenu: showCommunitySubMenu,
            nestedSubMenu: [
                { path: "/createCommunity", name: "Create Community" },
                { path: "/updateCommunity", name: "Update Community" },
                { path: "/deleteCommunity", name: "Delete Community" }
            ]
        });
    }else if (currentUser === 'Interest admin') {
        menuItem.unshift({
                   name: <pre style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>Interest admin</pre>,
                    path: "#",
                    toggleSubMenu: toggleInterestSubMenu,
                    showSubMenu: showInterestSubMenu,
                    nestedSubMenu: [
                        { path: "/createInterest", name: "Create Interest" },
                        { path: "/updateInterest", name: "Update Interest" },
                        { path: "/deleteInterest", name: "Delete Interest" }
                    ]
        });
    }else if (currentUser === 'Publisher admin') {
        menuItem.unshift({
            name: "Publisher admin",
                    path: "#",
                    toggleSubMenu: toggleShowJournalReviewerSubMenu,
                    showSubMenu: showJournalReviewerSubMenu,
                    Publishersubmenu: [
                        {
                            name: "Books Management",
                            path: "#",
                            toggleSubMenu: toggleBooksManagementSubMenu,
                            showSubMenu: showBooksManagementSubMenu,
                            PublisherbooksMenu: [
                                { path: "/PublishedBooks", name: "Published Books" },
                                { path: "/ApplicationForReviewer", name: "Books Under Publishing" }
                            ]
                        },
                        {
                            name: "Employee management",
                            path: "#",
                            toggleSubMenu: toggleEmployeeManagementSubMenu,
                            showSubMenu: showEmployeeManagementSubMenu,
                            PublisheremployeeMenu: [
                                { path: "/AddEmp", name: "Add Employee" },
                                { path: "/UpdateEmployee", name: "Update Employee" },
                                { path: "/DeactivateEmp", name: "Deactivate Employee" },
                                { path: "/SearchEmployee", name: "Search Employee" }
                            ]
                        },
                        
                    ]
       
        
        });
    }else if (currentUser === 'Editor') {
        menuItem.unshift({
            name:"Editor",  
                    path: "#",
                    toggleSubMenu: toggleShowBookReviewerSubMenu,
                    showSubMenu: showBookReviewerSubMenu,
                    nestedSubMenu: [
                        { path: "/BookReviewer", name: "Editor" },
                    ]
        });
    }else if (currentUser === 'Corporate admin'||currentUser === 'corporate') {
        menuItem.unshift({
            name: "Corporate",
            path: "#",
            submenu: [
                {
                    name: "Corporate admin",
                    path: "#",
                    toggleSubMenu: toggleCorporateManagementSubMenu,
                    showSubMenu: showCorporateManagementSubMenu,
                    corporateMenu: [
                        {
                            name: "Employee management",
                            path: "#",
                            toggleSubMenu: toggleCorporateEmployeeManagementSubMenu,
                            showSubMenu: showCorporateEmployeeManagementSubMenu,
                            employeeMenu: [
                                { path: "/AddEmp", name: "Add Employee" },
                                { path: "/UpdateEmployee", name: "Update Employee" },
                                { path: "/DeactivateEmp", name: "Deactivate Employee" },
                                { path: "/SearchEmployee", name: "Search Employee" }
                            ]
                        },
                        {
                            name: "Books Management",
                            path: "#",
                            toggleSubMenu: toggleCorporateBooksManagementSubMenu,
                            showSubMenu: showCorporateBooksManagementSubMenu,
                            booksMenu: [
                                { path: "/PublishedBooks", name: "Published Books" },
                                { path: "/BooksUnderPublishing", name: "Books Under Publishing" },
                                { path: "/SearchBook", name: "Search Book" }
                            ]
                        },
                        {
                            name: "Journal Management",
                            path: "#",
                            toggleSubMenu: toggleJournalManagementSubMenu,
                            showSubMenu: showJournalManagementSubMenu,
                            journalMenu: [
                                { path: "/PublishedJournals", name: "Published Journals" },
                                { path: "/ApplicationForReviewer", name: "Journals Under Review" },
                                { path: "/SearchJournals", name: "Search Journals" }
                            ]
                        },
                      
                    ]
                }
                    
            ]
       
        
        });
    }
   

    const renderSubMenu = (subMenuItems, showSubMenu, toggleSubMenu) => (
        <div
            onMouseEnter={() => toggleSubMenu(true)}
            onMouseLeave={() => toggleSubMenu(false)}
        >
            <div
                className={`link ${showSubMenu ? 'active' : ''}`}
                onClick={() => toggleSubMenu(!showSubMenu)}
            >
                <div className="link_text">{subMenuItems.name}</div>
            </div>
            {showSubMenu && (
                <div className="toggleSubMenu">
                    {subMenuItems.employeeMenu && subMenuItems.employeeMenu.map((item, index) => (
                        <NavLink to={item.path} key={index} className="link" activeClassName="active">
                            <div className="link_text">{item.name}</div>
                        </NavLink>
                    ))}
                    {subMenuItems.IJSTMenu && subMenuItems.IJSTMenu.map((item, index) => (
                        <NavLink to={item.path} key={index} className="link" activeClassName="active">
                            <div className="link_text">{item.name}</div>
                        </NavLink>
                    ))}
                    {subMenuItems.communityMenu && subMenuItems.communityMenu.map((item, index) => (
                        <NavLink to={item.path} key={index} className="link" activeClassName="active">
                            <div className="link_text">{item.name}</div>
                        </NavLink>
                    ))}
                    {subMenuItems.interestMenu && subMenuItems.interestMenu.map((item, index) => (
                        <NavLink to={item.path} key={index} className="link" activeClassName="active">
                            <div className="link_text">{item.name}</div>
                        </NavLink>
                    ))}
                    {subMenuItems.Publishersubmenu && subMenuItems.Publishersubmenu.map((item, index) => (
                        <NestedSubMenu key={index} item={item} />
                    ))}
                    {subMenuItems.bookMenu && subMenuItems.bookMenu.map((item, index) => (
                        <NavLink to={item.path} key={index} className="link" activeClassName="active">
                            <div className="link_text">{item.name}</div>
                        </NavLink>
                    ))}
                    {subMenuItems.corporateMenu && subMenuItems.corporateMenu.map((item, index) => (
                        <NestedSubMenu key={index} item={item} />
                    ))}
                    {subMenuItems.TechnologyandindustryMenu && subMenuItems.TechnologyandindustryMenu.map((item, index) => (
                        <NavLink to={item.path} key={index} className="link" activeClassName="active">
                            <div className="link_text">{item.name}</div>
                        </NavLink>
                    ))}
                     {subMenuItems.CouponMenu && subMenuItems.CouponMenu.map((item, index) => (
                        <NavLink to={item.path} key={index} className="link" activeClassName="active">
                            <div className="link_text">{item.name}</div>
                        </NavLink>
                    ))}


                </div>
            )}
        </div>
    );
    
    
    const NestedSubMenu = ({ item }) => {
        const [showNestedSubMenu, setShowNestedSubMenu] = useState(false);
    
        return (
            <div
                className={`link ${showNestedSubMenu ? 'active' : ''}`}
                onMouseEnter={() => setShowNestedSubMenu(true)}
                onMouseLeave={() => setShowNestedSubMenu(false)}
            >
                <div className="link_text">{item.name}</div>
                {showNestedSubMenu && (
                    <div style={{backgroundColor:'#414558'}}>
                        {item.PublisherbooksMenu && item.PublisherbooksMenu.map((nestedItem, nestedIndex) => (
                            <NavLink to={nestedItem.path} key={nestedIndex} className="link" activeClassName="active">
                                <div className="link_text">{nestedItem.name}</div>
                            </NavLink>
                        ))}
                        {item.PublisheremployeeMenu && item.PublisheremployeeMenu.map((nestedItem, nestedIndex) => (
                            <NavLink to={nestedItem.path} key={nestedIndex} className="link" activeClassName="active">
                                <div className="link_text">{nestedItem.name}</div>
                            </NavLink>
                        ))}
                        
                        {item.employeeMenu && item.employeeMenu.map((nestedItem, nestedIndex) => (
                            <NavLink to={nestedItem.path} key={nestedIndex} className="link" activeClassName="active">
                                <div className="link_text">{nestedItem.name}</div>
                            </NavLink>
                        ))}
                        {item.booksMenu && item.booksMenu.map((nestedItem, nestedIndex) => (
                            <NavLink to={nestedItem.path} key={nestedIndex} className="link" activeClassName="active">
                                <div className="link_text">{nestedItem.name}</div>
                            </NavLink>
                        ))}
                        {item.journalMenu && item.journalMenu.map((nestedItem, nestedIndex) => (
                            <NavLink to={nestedItem.path} key={nestedIndex} className="link" activeClassName="active">
                                <div className="link_text">{nestedItem.name}</div>
                            </NavLink>
                        ))}
                    </div>
                )}
            </div>
        );
    };
    
 
    

    console.log("currentUser:", currentUser);
    return (
        <div className="container">
            <div style={{ width: isOpen ? "200px" : '60px' }} className="sidebar">
                <div className="top_section">
                    <div style={{ marginLeft: isOpen ? "15%" : "5%" }} className="bars">
                        <FaBars onClick={toggle} />
                    </div>
                </div>
                {menuItem.map((item, index) => (
                    <div key={index}>
                        <NavLink
                            to={item.path}
                            className={`link ${item.name === 'Website Admin' && showAdminSubMenu ? 'active' : ''}`}
                            onClick={() => item.name === 'Website Admin' && toggleAdminSubMenu()}
                        >
                            <div className="icon">{item.icon}</div>
                            <div style={{ display: isOpen ? "block" : "none" }} className="link_text">{item.name}</div>
                            {item.name === 'Website Admin' && <div className="arrow">{showAdminSubMenu ? '▲' : '▼'}</div>}
                        </NavLink>
                        {item.name === 'Website Admin' && showAdminSubMenu && (
                            <div className="submenu">
                                {item.submenu?.map((subItem, subIndex) => (
                                    <div key={subIndex}>
                                        {renderSubMenu(subItem, subItem.showSubMenu, subItem.toggleSubMenu)}
                                    </div>
                                ))}
                            </div>
                        )}

                   {currentUser === 'User admin' &&  (
                        <div className="submenu">
                            {item.nestedSubMenu?.map((nestedSubItem, nestedSubIndex) => (
                                <NavLink to={nestedSubItem.path} key={nestedSubIndex} className="link" activeClassName="active">
                                    <div className="link_text">{nestedSubItem.name}</div>
                                </NavLink>
                            ))}
                        </div>
                    )}
                    {currentUser === 'Community admin' && (
                        <div className="submenu">
                            {item.nestedSubMenu?.map((nestedSubItem, nestedSubIndex) => (
                                <NavLink to={nestedSubItem.path} key={nestedSubIndex} className="link" activeClassName="active">
                                    <div className="link_text">{nestedSubItem.name}</div>
                                </NavLink>
                            ))}
                        </div>
                    )}

                    {currentUser === 'Interest admin' &&  (
                        <div className="submenu">
                            {item.nestedSubMenu?.map((nestedSubItem, nestedSubIndex) => (
                                <NavLink to={nestedSubItem.path} key={nestedSubIndex} className="link" activeClassName="active">
                                    <div className="link_text">{nestedSubItem.name}</div>
                                </NavLink>
                            ))}
                        </div>
                    )}
                      {currentUser === 'Editor' && (
                        <div className="submenu">
                            {item.nestedSubMenu?.map((nestedSubItem, nestedSubIndex) => (
                                <NavLink to={nestedSubItem.path} key={nestedSubIndex} className="link" activeClassName="active">
                                    <div className="link_text">{nestedSubItem.name}</div>
                                </NavLink>
                            ))}
                        </div>
                    )}
                         
                     {currentUser === 'publisher' && item.name === 'Publisher admin' && (
                                <div className="submenu">
                                    {item.corporateMenu?.map((subItem, subIndex) => (
                                        <div key={subIndex}>
                                            {renderSubMenu(subItem, subItem.showSubMenu, subItem.toggleSubMenu)}
                                        </div>
                                    ))}
                                </div>
                            )}
                     {currentUser === 'Corporate admin' &&  (
                        <div className="submenu">
                            {item.nestedSubMenu?.map((nestedSubItem, nestedSubIndex) => (
                                <NavLink to={nestedSubItem.path} key={nestedSubIndex} className="link" activeClassName="active">
                                    <div className="link_text">{nestedSubItem.name}</div>
                                </NavLink>
                            ))}
                        </div>
                    )}
                    
                      
                           {currentUser === 'corporate' && item.name === 'Corporate' && (
                            <div className="submenu">
                                {item.submenu?.map((subItem, subIndex) => (
                                    <div key={subIndex}>
                                        {renderSubMenu(subItem, subItem.showSubMenu, subItem.toggleSubMenu)}
                                    </div>
                                ))}
                            </div>
                        )}

                     <div>
                    </div>
                    </div>
                ))}
            </div>
            <main>{children}</main>
        </div>
    );

};

 export default Sidebar;



