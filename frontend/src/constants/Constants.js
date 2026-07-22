const mockPackages = {
  hotDeals: [
    {
      id: 1,
      title: "Golden Triangle Tour",
      location: "Delhi • Agra • Jaipur",
      duration: "5 Nights / 6 Days",
      price: 24537,
      tags: ["Heritage", "Family"],
      image:
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800",
    },
    {
      id: 2,
      title: "Goa Beach Escape",
      location: "Goa",
      duration: "4 Nights / 5 Days",
      price: 18500,
      tags: ["Beach", "Honeymoon"],
      image:
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
    },
    {
      id: 3,
      title: "Rajasthan Royal Retreat",
      location: "Udaipur • Jodhpur",
      duration: "6 Nights / 7 Days",
      price: 32900,
      tags: ["Luxury", "Heritage"],
      image:
        "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800",
    },
    {
      id: 4,
      title: "Kashmir Paradise",
      location: "Srinagar • Gulmarg",
      duration: "5 Nights / 6 Days",
      price: 29800,
      tags: ["Snow", "Nature"],
      image:
        "https://images.unsplash.com/photo-1598091383021-15ddea10925d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dw=800",
    },
    {
      id: 5,
      title: "Andaman Island Bliss",
      location: "Havelock Island",
      duration: "6 Nights / 7 Days",
      price: 36500,
      tags: ["Island", "Scuba"],
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    },
    {
      id: 6,
      title: "Shimla Manali Combo",
      location: "Shimla • Manali",
      duration: "7 Nights / 8 Days",
      price: 27999,
      tags: ["Snow", "Adventure"],
      image:
        "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800",
    },
    {
      id: 7,
      title: "Kerala Houseboat Stay",
      location: "Alleppey",
      duration: "3 Nights / 4 Days",
      price: 21500,
      tags: ["Backwaters", "Luxury"],
      image:
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800",
    },
    {
      id: 8,
      title: "Darjeeling Tea Trails",
      location: "Darjeeling",
      duration: "4 Nights / 5 Days",
      price: 19800,
      tags: ["Mountains", "Relax"],
      image:
        "https://images.unsplash.com/photo-1721070025492-26368db1706f?q=80&w=2232&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=800",
    },
  ],

  trendingDeals: [
    {
      id: 9,
      title: "Ladakh Adventure Trail",
      location: "Leh • Nubra Valley",
      duration: "8 Nights / 9 Days",
      price: 47840,
      tags: ["Adventure", "Biker"],
      image:
        "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=800",
    },
    {
      id: 10,
      title: "Rishikesh River Rafting",
      location: "Rishikesh",
      duration: "3 Nights / 4 Days",
      price: 14500,
      tags: ["Adventure", "River"],
      image:
        "https://images.unsplash.com/photo-1598610882061-bb806386c5fb?q=80&w=2065&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=800",
    },
    {
      id: 11,
      title: "Spiti Valley Expedition",
      location: "Spiti, Himachal",
      duration: "9 Nights / 10 Days",
      price: 39900,
      tags: ["Mountains", "Road Trip"],
      image:
        "https://images.unsplash.com/photo-1746093846930-ab89242b9fb9?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=800",
    },
    {
      id: 12,
      title: "Meghalaya Waterfall Tour",
      location: "Shillong • Cherrapunji",
      duration: "5 Nights / 6 Days",
      price: 26800,
      tags: ["Nature", "Waterfalls"],
      image:
        "https://images.unsplash.com/photo-1625826415128-3fbae9b3022c?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=800",
    },
    {
      id: 13,
      title: "Hampi Heritage Escape",
      location: "Hampi, Karnataka",
      duration: "4 Nights / 5 Days",
      price: 17500,
      tags: ["Heritage", "History"],
      image:
        "https://images.unsplash.com/photo-1632408011026-b7375a96ae8c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=800",
    },
    {
      id: 14,
      title: "Coorg Coffee Retreat",
      location: "Coorg, Karnataka",
      duration: "3 Nights / 4 Days",
      price: 16500,
      tags: ["Nature", "Relax"],
      image:
        "https://images.unsplash.com/photo-1686532794194-5a8a74e3633e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=800",
    },
    {
      id: 15,
      title: "Ooty Hill Escape",
      location: "Ooty, Tamil Nadu",
      duration: "4 Nights / 5 Days",
      price: 18900,
      tags: ["Hills", "Family"],
      image:
        "https://images.unsplash.com/photo-1771149149669-abe6fade279c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=800",
    },
    {
      id: 16,
      title: "Kedarnath Yatra",
      location: "Uttarakhand",
      duration: "3 Nights / 4 Days",
      price: 15500,
      tags: ["Spiritual", "Trekking"],
      image:
        "https://images.unsplash.com/photo-1612438214708-f428a707dd4e?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=800",
    },
  ],

  exclusiveDeals: [
    {
      id: 17,
      title: "Lakshadweep Luxury Escape",
      location: "Lakshadweep",
      duration: "6 Nights / 7 Days",
      price: 54900,
      tags: ["Island", "Luxury"],
      image:
        "https://images.unsplash.com/photo-1646130322178-c9d8da261891?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=800",
    },
    {
      id: 18,
      title: "Rann of Kutch Festival",
      location: "Gujarat",
      duration: "4 Nights / 5 Days",
      price: 25900,
      tags: ["Festival", "Culture"],
      image:
        "https://images.unsplash.com/photo-1669015881702-951de590db31?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=800",
    },
    {
      id: 19,
      title: "Sikkim Scenic Journey",
      location: "Gangtok • Tsomgo Lake",
      duration: "5 Nights / 6 Days",
      price: 28900,
      tags: ["Mountains", "Nature"],
      image:
        "https://images.unsplash.com/photo-1573398643956-2b9e6ade3456?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=800",
    },
    {
      id: 20,
      title: "Tawang Hidden Gem",
      location: "Arunachal Pradesh",
      duration: "6 Nights / 7 Days",
      price: 33500,
      tags: ["Adventure", "Remote"],
      image:
        "https://images.unsplash.com/photo-1668437824006-1be44600774b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=800",
    },
    {
      id: 21,
      title: "Mahabaleshwar Escape",
      location: "Maharashtra",
      duration: "3 Nights / 4 Days",
      price: 13900,
      tags: ["Hill Station", "Relax"],
      image:
        "https://images.unsplash.com/photo-1574323109400-7477368b7b03?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=800",
    },
    {
      id: 22,
      title: "Gokarna Beach Vibes",
      location: "Karnataka",
      duration: "4 Nights / 5 Days",
      price: 17800,
      tags: ["Beach", "Backpacking"],
      image:
        "https://images.unsplash.com/photo-1585435126652-f17450710377?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=800",
    },
    {
      id: 23,
      title: "Mysore Palace Tour",
      location: "Mysore",
      duration: "2 Nights / 3 Days",
      price: 12500,
      tags: ["Heritage", "Culture"],
      image:
        "https://images.unsplash.com/photo-1600112356915-089abb8fc71a?q=80&w=2194&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=800",
    },
    {
      id: 24,
      title: "Kaziranga Wildlife Safari",
      location: "Assam",
      duration: "4 Nights / 5 Days",
      price: 31200,
      tags: ["Wildlife", "Safari"],
      image:
        "https://images.unsplash.com/photo-1768622168969-4305586153a9?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=800",
    },
  ],
};

export default mockPackages;

// corporateData.js
export const whyChooseUs = [
  "Customized corporate and leisure travel solutions",
  "Reliable ticket booking and accommodation management",
  "Dedicated customer support and travel coordination",
  "Transparent pricing with no hidden charges",
  "Strong vendor network across destinations",
  "Personalized travel assistance and facilitation",
];

export const services = [
  {
    title: "Air Bookings",
    icon: "plane",
    description:
      "Domestic and international airline booking support with optimized fares and travel routes.",
  },
  {
    title: "Hotel Bookings",
    icon: "hotel",
    description:
      "Premium hotel booking solutions tailored for business and leisure travelers.",
  },
  {
    title: "Visa Assistance",
    icon: "visa",
    description:
      "Complete visa support including documentation, applications and embassy coordination.",
  },
  {
    title: "Cab & Bus Services",
    icon: "bus",
    description:
      "Reliable cab, luxury car, tempo traveller and bus arrangements for corporate teams.",
  },
  {
    title: "Train Bookings",
    icon: "train",
    description:
      "Authorized railway booking services with smooth and hassle-free arrangements.",
  },
  {
    title: "Tour Packages",
    icon: "globe",
    description:
      "Customized domestic and international travel packages for every requirement.",
  },
];

export const paymentModels = [
  {
    title: "Prepaid Model",
    subtitle: "Best for high-volume bookings",
    features: [
      "No service charges on air & hotel bookings",
      "Discounted rail booking charges",
      "Periodic ledger sharing",
      "Prepaid deposit management",
    ],
  },
  {
    title: "Standard Cycle",
    subtitle: "Flexible monthly payment cycle",
    features: [
      "Structured billing cycles",
      "Domestic & international bookings",
      "Corporate support assistance",
      "Optimized payment scheduling",
    ],
  },
  {
    title: "Extended Credit",
    subtitle: "Longer payment flexibility",
    features: [
      "Extended due dates",
      "Flexible credit management",
      "Visa processing support",
      "Corporate-friendly structure",
    ],
  },
];

// input constants
export const packagesInputs = [
  {
    label: "Name",
    placeHolder: "Enter your full name",
    name: "contactPersonName",
    type: "text",
  },
  {
    label: "Contact Number",
    placeHolder: "Enter your contact number",
    name: "contactPersonPhone",
    type: "text",
  },
  {
    label: "Email",
    placeHolder: "Enter your email",
    name: "contactPersonEmail",
    type: "email",
  },
  {
    label: "Number of persons",
    placeHolder: "Count of persons",
    name: "numberOfPerson",
    type: "number",
  },
  {
    label: "From Date",
    placeHolder: "From date",
    name: "fromDate",
    type: "date",
  },
  {
    label: "To Date",
    placeHolder: "To date",
    name: "toDate",
    type: "date",
  },
];

export const personalInputs = [
  {
    label: "Name",
    placeHolder: "Enter your full name",
    name: "name",
    type: "text",
  },
  {
    label: "Email",
    placeHolder: "Enter your email",
    name: "email",
    type: "email",
  },
  {
    label: "Contact Number",
    placeHolder: "Enter your contact number",
    name: "contactNumber",
    type: "text",
  },
  // {
  //   label: "Pan Card",
  //   placeHolder: "Enter your PAN number",
  //   name: "pan",
  //   type: "text",
  //   required: false,
  // },
  // {
  //   label: "Aadhar Card",
  //   placeHolder: "Enter your aadhar number",
  //   name: "aadhar",
  //   type: "text",
  //   required: false,
  // },
  {
    label: "Password",
    placeHolder: "Password",
    name: "password",
    type: "password",
    passwordTrue: true,
  },
  // {
  //   label: "Are you a Solo Traveler",
  //   placeHolder: "Yes or No",
  //   name: "soloTraveler",
  //   type: "text",
  //   required: false,
  // },
];

export const communityInputs = [
  {
    label: "Community Name",
    placeHolder: "Enter your Username, Channel name, Blog name etc.",
    name: "communityName",
    type: "text",
  },
  // {
  //   label: "GST",
  //   placeHolder: "Enter your GST number",
  //   name: "gst",
  //   type: "text",
  //   required: false,
  // },
  {
    label: "Community Contact Number",
    placeHolder: "Enter your alternative contact number",
    name: "communityContactNumber",
    type: "text",
  },
  {
    label: "Community email",
    placeHolder: "Enter your community email",
    name: "communityEmail",
    type: "email",
    required: false,
  },
  {
    label: "Profession",
    placeHolder: "Eg: Influencer, Blogger, Bike group, Solo Traveler etc.",
    name: "profession",
    type: "text",
  },
  // {
  //   label: "Bank Name",
  //   placeHolder: "Enter bank name",
  //   name: "bankName",
  //   type: "text",
  //   required: false,
  // },
  // {
  //   label: "IFSC code",
  //   placeHolder: "Enter branch IFSC code",
  //   name: "ifsc",
  //   type: "text",
  //   required: false,
  // },
  // {
  //   label: "Account number",
  //   placeHolder: "Enter your bank account number",
  //   name: "accountNumber",
  //   type: "text",
  //   required: false,
  // },
  // {
  //   label: "Account holder name",
  //   placeHolder: "Account holder name",
  //   name: "accountHolderName",
  //   type: "text",
  //   required: false,
  // },
  {
    label: "Community Creation",
    placeHolder: "Year in which you started channel, blogging etc.",
    name: "communityEstablishment",
    type: "number",
    required: false,
  },
  // {
  //   label: "Pan Card",
  //   placeHolder: "Enter your PAN number",
  //   name: "pan",
  //   type: "text",
  //   required: false,
  // },
  // {
  //   label: "Aadhar Card",
  //   placeHolder: "Enter your aadhar number",
  //   name: "aadhar",
  //   type: "text",
  //   required: false,
  // },
  // {
  //   label: "About",
  //   placeHolder: "Write somethings about your works",
  //   name: "about",
  //   type: "text",
  //   required: false,
  // },
];

export const userFormInputs = [
  {
    label: "Name",
    placeHolder: "Enter your full name",
    name: "name",
    type: "text",
  },
  {
    label: "Email",
    placeHolder: "Enter your email",
    name: "email",
    type: "email",
  },
  {
    label: "Address",
    placeHolder: "Corresponding address",
    name: "address",
    type: "text",
  },
];

export const foodKiosksFormInputs = [
  {
    label: "Food Place Name (Kiosk, Stall, Shop, Outlet etc.)",
    placeHolder: "Enter food place name",
    name: "name",
    type: "text",
  },
  {
    label: "Email",
    placeHolder: "Enter email",
    name: "email",
    type: "email",
    required: false,
  },
  {
    label: "Contact number",
    placeHolder: "Enter contact number",
    name: "contactNumber",
    type: "text",
  },
  {
    label: "Special food",
    placeHolder: "Enter special food of this place",
    name: "specialFood",
    type: "text",
  },
  {
    label: "Longitude",
    placeHolder: "Longitude of the place",
    name: "lng",
    type: "text",
    required: false,
    classname: "hidden",
  },
  {
    label: "Latitude",
    placeHolder: "Latitude of the place",
    name: "lat",
    type: "text",
    required: false,
    classname: "hidden",
  },
  {
    label: "Establishment",
    placeHolder: "Place establishment year",
    name: "establishment",
    type: "text",
    required: false,
  },
];

export const contactUsFormInputs = [
  {
    label: "Name",
    placeHolder: "Enter your full name",
    name: "contactPersonName",
    type: "text",
  },
  {
    label: "Email",
    placeHolder: "Enter your email",
    name: "contactPersonEmail",
    type: "email",
  },
  {
    label: "Contact number",
    placeHolder: "Contact number",
    name: "contactPersonPhone",
    type: "text",
  },
];

export const subAdminFormInputs = [
  {
    label: "Name",
    placeHolder: "Enter name",
    name: "name",
    type: "text",
  },
  {
    label: "Employee ID",
    placeHolder: "Enter employee id",
    name: "employeeId",
    type: "text",
  },
  {
    label: "Email",
    placeHolder: "Enter email",
    name: "email",
    type: "email",
  },
  {
    label: "Contact Number",
    placeHolder: "Enter your contact number",
    name: "phoneNumber",
    type: "text",
  },
  {
    label: "Password",
    placeHolder: "Password",
    name: "password",
    type: "password",
    passwordTrue: true,
  },
];

export const corporateEnquiryForm = [
  {
    label: "Company's Name",
    placeHolder: "Company name",
    name: "companyName",
    type: "text",
  },
  {
    label: "Company's Email",
    placeHolder: "Company's email",
    name: "companyEmail",
    type: "email",
  },
  {
    label: "Contact Person Name",
    placeHolder: "Contact person's name",
    name: "contactPersonName",
    type: "text",
  },
  {
    label: "Contact Person Designation",
    placeHolder: "Contact person's designation",
    name: "contactPersonDesignation",
    type: "text",
  },
  {
    label: "Contact Number",
    placeHolder: "Contact number",
    name: "contactNumber",
    type: "text",
  },
];

export const communityMembersInputs = [
  {
    label: "Full name",
    placeHolder: "Enter new members name",
    name: "name",
    type: "text",
  },
  {
    label: "Email",
    placeHolder: "Mail ID",
    name: "email",
    type: "email",
  },
  {
    label: "Contact number",
    placeHolder: "Enter contact number",
    name: "phone",
    type: "text",
  },
  {
    label: "Address",
    placeHolder: "Enter the address",
    name: "address",
    type: "text",
  },
];

export const guestEventEnquiryInputs = [
  {
    label: "Full name",
    placeHolder: "Enter new members name",
    name: "name",
    type: "text",
  },
  {
    label: "Email",
    placeHolder: "Mail ID",
    name: "email",
    type: "email",
  },
  {
    label: "Contact number",
    placeHolder: "Enter contact number",
    name: "contactNumber",
    type: "text",
  },
  {
    label: "Address",
    placeHolder: "Enter the address",
    name: "address",
    type: "text",
  },
];

export const INDIAN_AIRPORTS = [
  { city: "Delhi", code: "DEL" },
  { city: "Mumbai", code: "BOM" },
  { city: "Bengaluru", code: "BLR" },
  { city: "Hyderabad", code: "HYD" },
  { city: "Chennai", code: "MAA" },
  { city: "Kolkata", code: "CCU" },
  { city: "Ahmedabad", code: "AMD" },
  { city: "Pune", code: "PNQ" },
  { city: "Jaipur", code: "JAI" },
  { city: "Lucknow", code: "LKO" },
  { city: "Ranchi", code: "IXR" },
  { city: "Patna", code: "PAT" },
  { city: "Varanasi", code: "VNS" },
  { city: "Prayagraj", code: "IXD" },
  { city: "Agra", code: "AGR" },
  { city: "Ayodhya", code: "AYJ" },
  { city: "Gorakhpur", code: "GOP" },
  { city: "Kanpur", code: "KNU" },
  { city: "Dehradun", code: "DED" },
  { city: "Chandigarh", code: "IXC" },
  { city: "Amritsar", code: "ATQ" },
  { city: "Srinagar", code: "SXR" },
  { city: "Jammu", code: "IXJ" },
  { city: "Leh", code: "IXL" },
  { city: "Shimla", code: "SLV" },
  { city: "Dharamshala", code: "DHM" },
  { city: "Goa", code: "GOI" },
  { city: "Goa (Mopa)", code: "GOX" },
  { city: "Kochi", code: "COK" },
  { city: "Thiruvananthapuram", code: "TRV" },
  { city: "Kozhikode", code: "CCJ" },
  { city: "Mangalore", code: "IXE" },
  { city: "Mysuru", code: "MYQ" },
  { city: "Coimbatore", code: "CJB" },
  { city: "Madurai", code: "IXM" },
  { city: "Tiruchirappalli", code: "TRZ" },
  { city: "Visakhapatnam", code: "VTZ" },
  { city: "Vijayawada", code: "VGA" },
  { city: "Tirupati", code: "TIR" },
  { city: "Bhubaneswar", code: "BBI" },
  { city: "Raipur", code: "RPR" },
  { city: "Nagpur", code: "NAG" },
  { city: "Indore", code: "IDR" },
  { city: "Bhopal", code: "BHO" },
  { city: "Jabalpur", code: "JLR" },
  { city: "Udaipur", code: "UDR" },
  { city: "Jodhpur", code: "JDH" },
  { city: "Surat", code: "STV" },
  { city: "Rajkot", code: "RAJ" },
  { city: "Guwahati", code: "GAU" },
  { city: "Imphal", code: "IMF" },
  { city: "Agartala", code: "IXA" },
  { city: "Shillong", code: "SHL" },
  { city: "Aizawl", code: "AJL" },
  { city: "Dibrugarh", code: "DIB" },
  { city: "Port Blair", code: "IXZ" },
];
