import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGlobe,
  faShieldAlt,
  faHeadset,
  faStar,
  faMapMarkerAlt,
  faPhoneAlt,
  faEnvelope,
  faClock,
} from '@fortawesome/free-solid-svg-icons';

/**
 * AboutUs component
 * @returns {jsx}
 */
const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-brand to-brand-dark text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              About <span className="text-yellow-300">Stay Booker</span>
            </h1>
            <p className="text-xl md:text-2xl font-light leading-relaxed">
              Your trusted partner in finding the perfect accommodation for your
              travels. We're dedicated to making your hotel booking experience
              seamless and enjoyable.
            </p>
          </div>
        </div>
        <div className="absolute -bottom-10 left-0 right-0 h-20 bg-white transform skew-y-2"></div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 -mt-10 relative z-20">
        {/* Vision Section */}
        <section className="bg-white rounded-2xl shadow-xl p-10 mb-16 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-100 rounded-full opacity-20"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-100 rounded-full opacity-20"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-brand mb-8">
              <span className="border-b-4 border-yellow-300 pb-2">
                Our Vision
              </span>
            </h2>
            <p className="text-lg md:text-xl text-slate-700 leading-relaxed mb-6">
              At <span className="text-brand font-semibold">Stay Booker</span>,
              we envision a world where every traveler finds their perfect
              accommodation match.
            </p>
            <p className="text-lg md:text-xl text-slate-700 leading-relaxed">
              We're committed to revolutionizing the hotel booking experience by
              offering a diverse range of options, from luxury resorts to cozy
              boutique stays, all while ensuring a seamless and secure booking
              process.
            </p>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-brand mb-4">
              Why Choose <span className="text-brand-dark">Us?</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We go above and beyond to ensure your travel experience is
              exceptional
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-brand text-3xl mb-6">
                <FontAwesomeIcon icon={faGlobe} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-800">
                Global Reach
              </h3>
              <p className="text-slate-600">
                Access to thousands of hotels worldwide, from major cities to
                hidden gems.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-brand text-3xl mb-6">
                <FontAwesomeIcon icon={faShieldAlt} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-800">
                Secure Booking
              </h3>
              <p className="text-slate-600">
                Your data and transactions are protected with industry-leading
                security measures.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center text-brand text-3xl mb-6">
                <FontAwesomeIcon icon={faHeadset} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-800">
                24/7 Support
              </h3>
              <p className="text-slate-600">
                Our dedicated team is always ready to assist you with any
                queries or concerns.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center text-brand text-3xl mb-6">
                <FontAwesomeIcon icon={faStar} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-800">
                Best Deals
              </h3>
              <p className="text-slate-600">
                Exclusive offers and competitive prices to ensure you get the
                best value.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-white rounded-2xl shadow-xl p-10 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-brand mb-4">
              What Our <span className="text-brand-dark">Users Say</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Don't just take our word for it - hear from our satisfied
              customers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-8 border border-slate-200 hover:border-brand transition-all duration-300">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <FontAwesomeIcon
                    key={i}
                    icon={faStar}
                    className="text-yellow-400 mr-1"
                  />
                ))}
              </div>
              <blockquote className="text-slate-700 mb-6 italic">
                "Stay Booker made my vacation planning so much easier! The
                interface is intuitive and the deals are amazing."
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-brand rounded-full flex items-center justify-center text-white font-bold mr-4">
                  SM
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Sarah M.</p>
                  <p className="text-sm text-slate-500">Frequent Traveler</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-8 border border-slate-200 hover:border-brand transition-all duration-300">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <FontAwesomeIcon
                    key={i}
                    icon={faStar}
                    className="text-yellow-400 mr-1"
                  />
                ))}
              </div>
              <blockquote className="text-slate-700 mb-6 italic">
                "The customer service is outstanding. They helped me find the
                perfect hotel for my business trip."
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-brand rounded-full flex items-center justify-center text-white font-bold mr-4">
                  JD
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Virat K.</p>
                  <p className="text-sm text-slate-500">Business Traveler</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-8 border border-slate-200 hover:border-brand transition-all duration-300">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <FontAwesomeIcon
                    key={i}
                    icon={faStar}
                    className="text-yellow-400 mr-1"
                  />
                ))}
              </div>
              <blockquote className="text-slate-700 mb-6 italic">
                "I love the variety of options and the detailed hotel
                information. It's my go-to platform for bookings."
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-brand rounded-full flex items-center justify-center text-white font-bold mr-4">
                  ER
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Rohit S.</p>
                  <p className="text-sm text-slate-500">Family Traveler</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-white rounded-2xl shadow-xl p-10">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-brand mb-8">
                <span className="border-b-4 border-yellow-300 pb-2">
                  Get in Touch
                </span>
              </h2>
              <p className="text-lg text-slate-700 mb-8 leading-relaxed">
                Have questions or need assistance? Our team is here to help you
                24/7. Reach out to us through any of the channels below.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-50 p-3 rounded-full mr-4">
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      className="text-brand text-xl"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">
                      Our Location
                    </h3>
                    <p className="text-slate-600">
                      Gomti nagar, near ABC hotel
                      <br />
                      Lucknow, Uttar Pradesh, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-50 p-3 rounded-full mr-4">
                    <FontAwesomeIcon
                      icon={faPhoneAlt}
                      className="text-brand text-xl"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">
                      Phone Number
                    </h3>
                    <p className="text-slate-600">+91 9335064632</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-purple-50 p-3 rounded-full mr-4">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="text-brand text-xl"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">
                      Email Address
                    </h3>
                    <p className="text-slate-600">
                      <a
                        href="mailto:shashwatdeo143@gmail.com"
                        className="hover:underline text-brand"
                      >
                        shashwatdeo143@gmail.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-yellow-50 p-3 rounded-full mr-4">
                    <FontAwesomeIcon
                      icon={faClock}
                      className="text-brand text-xl"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">
                      Business Hours
                    </h3>
                    <p className="text-slate-600">
                      Monday - Friday: 9:00 AM - 6:00 PM
                      <br />
                      Saturday: 10:00 AM - 4:00 PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2">
              <div className="bg-slate-50 rounded-xl p-8 h-full">
                <h3 className="text-2xl font-bold text-brand mb-6">
                  Send Us a Message
                </h3>
                <form className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand focus:border-brand transition-all"
                      placeholder="Shashwat Deo"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand focus:border-brand transition-all"
                      placeholder="shashwatdeo143@gmail.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand focus:border-brand transition-all"
                      placeholder="How can we help?"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows="4"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand focus:border-brand transition-all"
                      placeholder="Your message here..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
