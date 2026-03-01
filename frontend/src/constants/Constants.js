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
        "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800",
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
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",
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
        "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800",
    },
    {
      id: 10,
      title: "Rishikesh River Rafting",
      location: "Rishikesh",
      duration: "3 Nights / 4 Days",
      price: 14500,
      tags: ["Adventure", "River"],
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800",
    },
    {
      id: 11,
      title: "Spiti Valley Expedition",
      location: "Spiti, Himachal",
      duration: "9 Nights / 10 Days",
      price: 39900,
      tags: ["Mountains", "Road Trip"],
      image:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",
    },
    {
      id: 12,
      title: "Meghalaya Waterfall Tour",
      location: "Shillong • Cherrapunji",
      duration: "5 Nights / 6 Days",
      price: 26800,
      tags: ["Nature", "Waterfalls"],
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    },
    {
      id: 13,
      title: "Hampi Heritage Escape",
      location: "Hampi, Karnataka",
      duration: "4 Nights / 5 Days",
      price: 17500,
      tags: ["Heritage", "History"],
      image:
        "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=800",
    },
    {
      id: 14,
      title: "Coorg Coffee Retreat",
      location: "Coorg, Karnataka",
      duration: "3 Nights / 4 Days",
      price: 16500,
      tags: ["Nature", "Relax"],
      image:
        "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800",
    },
    {
      id: 15,
      title: "Ooty Hill Escape",
      location: "Ooty, Tamil Nadu",
      duration: "4 Nights / 5 Days",
      price: 18900,
      tags: ["Hills", "Family"],
      image:
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800",
    },
    {
      id: 16,
      title: "Kedarnath Yatra",
      location: "Uttarakhand",
      duration: "3 Nights / 4 Days",
      price: 15500,
      tags: ["Spiritual", "Trekking"],
      image:
        "https://images.unsplash.com/photo-1597756290641-9a9f8b40c88b?w=800",
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
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    },
    {
      id: 18,
      title: "Rann of Kutch Festival",
      location: "Gujarat",
      duration: "4 Nights / 5 Days",
      price: 25900,
      tags: ["Festival", "Culture"],
      image: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=800",
    },
    {
      id: 19,
      title: "Sikkim Scenic Journey",
      location: "Gangtok • Tsomgo Lake",
      duration: "5 Nights / 6 Days",
      price: 28900,
      tags: ["Mountains", "Nature"],
      image:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",
    },
    {
      id: 20,
      title: "Tawang Hidden Gem",
      location: "Arunachal Pradesh",
      duration: "6 Nights / 7 Days",
      price: 33500,
      tags: ["Adventure", "Remote"],
      image:
        "https://images.unsplash.com/photo-1526779259212-939e64788e3c?w=800",
    },
    {
      id: 21,
      title: "Mahabaleshwar Escape",
      location: "Maharashtra",
      duration: "3 Nights / 4 Days",
      price: 13900,
      tags: ["Hill Station", "Relax"],
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800",
    },
    {
      id: 22,
      title: "Gokarna Beach Vibes",
      location: "Karnataka",
      duration: "4 Nights / 5 Days",
      price: 17800,
      tags: ["Beach", "Backpacking"],
      image:
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
    },
    {
      id: 23,
      title: "Mysore Palace Tour",
      location: "Mysore",
      duration: "2 Nights / 3 Days",
      price: 12500,
      tags: ["Heritage", "Culture"],
      image:
        "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800",
    },
    {
      id: 24,
      title: "Kaziranga Wildlife Safari",
      location: "Assam",
      duration: "4 Nights / 5 Days",
      price: 31200,
      tags: ["Wildlife", "Safari"],
      image:
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800",
    },
  ],
};

export default mockPackages;

export const packagesInputs = [
  {
    label: "Name",
    placeHolder: "Enter your full name",
    name: "name",
    type: "text",
  },
  {
    label: "Contact Number",
    placeHolder: "Enter your contact number",
    name: "contactNumber",
    type: "text",
  },
  {
    label: "Email",
    placeHolder: "Enter your email",
    name: "email",
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
    placeHolder: "Enter your full name",
    name: "fromDate",
    type: "date",
  },
  {
    label: "To Date",
    placeHolder: "Enter your full name",
    name: "toDate",
    type: "date",
  },
];
