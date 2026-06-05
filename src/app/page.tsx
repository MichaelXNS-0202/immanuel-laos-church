import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Turn your Facebook page into an online store in minutes
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-orange-100">
            ສ້າງຮ້ານຄ້າອອນໄລນ໌ຂອງທ່ານໃນນາທີດຽວ. ແບ່ງປັນລິ້ງ, ຮັບອໍເດີ, ເຕີບໂຕທຸລະກິດ.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="btn-primary text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              Create Free Store
            </Link>
            <a
              href="#how-it-works"
              className="btn-secondary text-lg px-8 py-4 rounded-xl"
            >
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">3 simple steps to start selling</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                icon: '📦',
                title: 'Add Products',
                desc: 'Upload your product photos, set prices and descriptions. Your store is ready instantly.',
              },
              {
                step: '2',
                icon: '🔗',
                title: 'Share Links',
                desc: 'Share your store link on Facebook, WhatsApp, or anywhere your customers are.',
              },
              {
                step: '3',
                icon: '🛍️',
                title: 'Receive Orders',
                desc: 'Customers browse, order, and you get notified. Track every order in your dashboard.',
              },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl p-8 shadow-sm text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  {item.icon}
                </div>
                <div className="text-orange-500 font-bold text-sm mb-2">STEP {item.step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why LaoShopLink?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🆓', title: 'Free to Start', desc: 'No setup fees, no monthly charges to get started.' },
              { icon: '📱', title: 'Mobile Friendly', desc: 'Designed for mobile-first shopping experience.' },
              { icon: '🇱🇦', title: 'Made for Laos', desc: 'Lao language support, LAK currency, Lao provinces.' },
              { icon: '⚡', title: 'Instant Setup', desc: 'Your store goes live in under 5 minutes.' },
            ].map((b) => (
              <div key={b.title} className="bg-orange-50 rounded-xl p-6 text-center">
                <div className="text-4xl mb-3">{b.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{b.title}</h3>
                <p className="text-gray-600 text-sm">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-orange-500 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to grow your business?</h2>
          <p className="text-orange-100 mb-8 text-lg">Join hundreds of Lao sellers already using LaoShopLink.</p>
          <Link href="/auth/register" className="bg-white text-orange-500 font-bold py-4 px-10 rounded-xl text-lg hover:bg-orange-50 transition-colors inline-block">
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <span className="text-white font-bold text-xl">LaoShopLink</span>
            <p className="text-sm mt-1">ຮ້ານຄ້າອອນໄລນ໌ສຳລັບຄົນລາວ</p>
          </div>
          <div className="text-sm">
            &copy; {new Date().getFullYear()} LaoShopLink. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
