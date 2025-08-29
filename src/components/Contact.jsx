import { useState } from 'react'
import { Link } from 'react-router-dom'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Contact form submitted:', formData)
      setIsSubmitting(false)
      alert('Thank you for your message! We will get back to you soon.')
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    }, 2000)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const contactInfo = [
    {
      icon: "📧",
      title: "Email Us",
      details: "g.waheir00@gmail.com",
      description: "Send us an email anytime"
    },
    {
      icon: "📱",
      title: "Call Us",
      details: "+254 726899113",
      description: "Mon-Fri from 8am to 6pm"
    },
    {
      icon: "📍",
      title: "Visit Us",
      details: "Nairobi, Kenya",
      description: "Head office in the capital"
    }
  ]

  const faqs = [
    {
      question: "How do I find a fundi on your platform?",
      answer: "Simply browse our fundi listings, filter by service type and location, and contact the ones that match your needs."
    },
    {
      question: "Are all fundis on your platform verified?",
      answer: "Yes, we verify all fundis before they join our platform to ensure quality and reliability."
    },
    {
      question: "How does the payment system work?",
      answer: "We use M-Pesa for secure payments. You can pay for premium features and direct bookings through our platform."
    },
    {
      question: "What if I'm not satisfied with a fundi's work?",
      answer: "We have a rating and review system. If you're not satisfied, please contact our support team for assistance."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions or need help? We're here to assist you. 
            Reach out to our team and we'll get back to you as soon as possible.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {contactInfo.map((info, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="text-5xl mb-4">{info.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{info.title}</h3>
              <p className="text-blue-600 font-semibold text-lg mb-2">{info.details}</p>
              <p className="text-gray-600">{info.description}</p>
            </div>
          ))}
        </div>

        {/* Contact Form & Map Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="What is this about?"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending Message...
                  </div>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>

          {/* Map/Info Section */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Office Hours</h3>
                <div className="space-y-2 text-blue-100">
                  <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                  <p>Saturday: 9:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Response Time</h3>
                <p className="text-blue-100">We typically respond to all inquiries within 24 hours during business days.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Emergency Support</h3>
                <p className="text-blue-100">For urgent matters, please call us directly at +254 726899113</p>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-3">Why Choose FundiMatch?</h3>
              <ul className="space-y-2 text-blue-100 text-sm">
                <li>✓ Verified and trusted fundis</li>
                <li>✓ Secure M-Pesa payments</li>
                <li>✓ 24/7 customer support</li>
                <li>✓ Quality guarantee</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-3xl shadow-xl p-12 mb-16 border border-gray-100">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Find answers to common questions about our services</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Find trusted fundis for your next home project
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/fundi-profile"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              Find Fundis Now
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 text-lg font-semibold rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
