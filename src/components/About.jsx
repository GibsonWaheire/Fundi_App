import { Link } from 'react-router-dom'

const About = () => {
  const team = [
    {
      name: "Gibson Waheire",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      description: "Visionary entrepreneur passionate about revolutionizing home services in Kenya",
      linkedin: "#"
    }
  ]

  const values = [
    {
      icon: "🤝",
      title: "Trust & Verification",
      description: "Every fundi undergoes thorough verification to ensure reliability and quality"
    },
    {
      icon: "💎",
      title: "Quality Assurance",
      description: "We maintain high standards by only accepting skilled professionals"
    },
    {
      icon: "🌍",
      title: "Local Empowerment",
      description: "Supporting Kenyan businesses and building stronger communities"
    },
    {
      icon: "🚀",
      title: "Innovation First",
      description: "Leveraging technology to solve real-world problems efficiently"
    }
  ]

  const milestones = [
    {
      year: "2025",
      title: "Platform Launch",
      description: "FundiMatch officially launched in Kenya with core services"
    },
    {
      year: "2025",
      title: "User Growth",
      description: "Reached 15,000+ users and 8,000+ verified fundis"
    },
    {
      year: "2025",
      title: "Service Expansion",
      description: "Expanded to cover all major cities and service categories"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">About FundiMatch</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're revolutionizing how Kenyans find skilled professionals for their home projects. 
            Our mission is to connect you with trusted, verified fundis across Kenya.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-3xl shadow-xl p-12 mb-16 border border-gray-100">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                To create a trusted platform where Kenyans can easily find skilled professionals 
                for all their home service needs, while providing fundis with opportunities to 
                grow their businesses.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We believe that everyone deserves access to quality home services, and every 
                skilled professional deserves a platform to showcase their expertise.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Construction professionals at work"
                className="rounded-2xl shadow-lg"
              />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                F
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 mb-16 text-white">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Our Story</h2>
              <p className="text-lg mb-6 leading-relaxed text-blue-100">
                FundiMatch was born from a simple yet powerful observation: finding reliable professionals 
                for home projects in Kenya was often a frustrating, time-consuming, and sometimes risky process.
              </p>
              <p className="text-lg mb-6 leading-relaxed text-blue-100">
                Our founder, Gibson Waheire, experienced this firsthand when renovating his home. 
                After struggling to find trustworthy fundis and dealing with inconsistent quality, 
                he realized there had to be a better way.
              </p>
              <p className="text-lg leading-relaxed text-blue-100">
                The solution was clear: create a platform that connects skilled fundis with people 
                who need their services, with trust, verification, and quality at the core. 
                Thus, FundiMatch was born.
              </p>
            </div>
            <div className="text-center">
              <div className="text-8xl mb-4">🏠</div>
              <p className="text-xl font-semibold">Building Trust, One Project at a Time</p>
              <p className="text-blue-100 mt-2">From a personal challenge to a national solution</p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Founder</h2>
            <p className="text-xl text-gray-600">The visionary behind FundiMatch</p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-gray-100 shadow-lg"
                />
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-4 text-lg">{member.role}</p>
                <p className="text-gray-600 leading-relaxed text-lg mb-4">{member.description}</p>
                <a 
                  href={member.linkedin}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors duration-200"
                >
                  <span className="mr-2">🔗</span>
                  Connect on LinkedIn
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Section */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-12 mb-16 text-white">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">Our Impact</h2>
            <p className="text-xl text-green-100">Transforming the home services industry in Kenya</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">👷</div>
              <h3 className="text-2xl font-bold mb-3">Fundis Empowered</h3>
              <p className="text-green-100">8,000+ verified professionals now have access to more clients and better opportunities</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🏠</div>
              <h3 className="text-2xl font-bold mb-3">Homes Improved</h3>
              <p className="text-green-100">75,000+ projects completed, transforming homes across Kenya</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-2xl font-bold mb-3">Economic Growth</h3>
              <p className="text-green-100">Supporting local businesses and contributing to Kenya's economic development</p>
            </div>
          </div>
        </div>

        {/* Milestones Section */}
        <div className="bg-white rounded-3xl shadow-xl p-12 mb-16 border border-gray-100">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600">Key milestones in our growth story</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                  {milestone.year}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{milestone.title}</h3>
                <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of Kenyans who trust FundiMatch for their home projects
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/fundi-profile"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              Find Fundis Now
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 text-lg font-semibold rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
