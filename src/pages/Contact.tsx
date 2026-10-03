import React, { useState } from 'react';
import { useCompare } from '../context/CompareContext';
import { collegeService } from '../services/collegeService';
import { FadeIn } from '../components/ui/motion';

export const Contact: React.FC = () => {
  const { showToast } = useCompare();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    preferredState: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await collegeService.submitContact(formData);
      showToast('Thank you! Your inquiry has been recorded. Our counselor will contact you shortly.');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        preferredState: '',
      });
    } catch {
      showToast('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAFD] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#12305A] mb-4">Contact Admissions Advisory</h1>
            <p className="text-base sm:text-lg text-[#5F6F82]">
              Have questions about college admissions, management quotas, or counseling processes? Our expert counselors at Admission by Choice are here to help.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <FadeIn delay={0.1}>
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DCE5EF] shadow-xs">
              <h2 className="text-xl font-bold text-[#12305A] mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#12305A] mb-1" htmlFor="fullName">
                    Full Name <span className="text-[#F04A35]">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full h-10 px-3 rounded-lg border border-[#DCE5EF] text-sm text-[#12305A] placeholder:text-[#5F6F82]/60 focus:border-[#0757C9] focus:ring-1 focus:ring-[#0757C9]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#12305A] mb-1" htmlFor="email">
                      Email Address <span className="text-[#F04A35]">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full h-10 px-3 rounded-lg border border-[#DCE5EF] text-sm text-[#12305A] placeholder:text-[#5F6F82]/60 focus:border-[#0757C9] focus:ring-1 focus:ring-[#0757C9]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#12305A] mb-1" htmlFor="phone">
                      Phone Number <span className="text-[#F04A35]">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full h-10 px-3 rounded-lg border border-[#DCE5EF] text-sm text-[#12305A] placeholder:text-[#5F6F82]/60 focus:border-[#0757C9] focus:ring-1 focus:ring-[#0757C9]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#12305A] mb-1" htmlFor="subject">
                    Subject <span className="text-[#F04A35]">*</span>
                  </label>
                  <input
                    id="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="How can we help you?"
                    className="w-full h-10 px-3 rounded-lg border border-[#DCE5EF] text-sm text-[#12305A] placeholder:text-[#5F6F82]/60 focus:border-[#0757C9] focus:ring-1 focus:ring-[#0757C9]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#12305A] mb-1" htmlFor="preferredState">
                    Preferred State (Optional)
                  </label>
                  <select
                    id="preferredState"
                    value={formData.preferredState}
                    onChange={(e) => setFormData({ ...formData, preferredState: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-[#DCE5EF] text-sm text-[#12305A] bg-white focus:border-[#0757C9] focus:ring-1 focus:ring-[#0757C9]"
                  >
                    <option value="">Select a state</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Rajasthan">Rajasthan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#12305A] mb-1" htmlFor="message">
                    Message <span className="text-[#F04A35]">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us more about your admission requirements..."
                    className="w-full p-3 rounded-lg border border-[#DCE5EF] text-sm text-[#12305A] placeholder:text-[#5F6F82]/60 focus:border-[#0757C9] focus:ring-1 focus:ring-[#0757C9] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#0757C9] text-white text-sm font-semibold hover:bg-[#06449E] transition-all active:scale-[0.98] shadow-xs flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">send</span>
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </FadeIn>

          {/* Contact Info */}
          <FadeIn delay={0.2}>
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DCE5EF] shadow-xs">
                <h2 className="text-xl font-bold text-[#12305A] mb-6">Get in Touch</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <a
                      href="tel:+917879084889"
                      className="w-10 h-10 rounded-lg bg-[#0757C9]/10 text-[#0757C9] flex items-center justify-center shrink-0 hover:bg-[#0757C9] hover:text-white transition-colors"
                      title="Call Helpline"
                    >
                      <span className="material-symbols-outlined text-[20px]">call</span>
                    </a>
                    <div>
                      <h3 className="text-sm font-bold text-[#12305A] mb-1">Helpline Number</h3>
                      <a
                        href="tel:+917879084889"
                        className="text-sm text-[#0757C9] hover:underline font-semibold block"
                      >
                        +91 78790 84889
                      </a>
                      <p className="text-xs text-[#5F6F82]">Mon-Sat, 9 AM - 7 PM IST</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <a
                      href="mailto:admissionbychoice@gmail.com"
                      className="w-10 h-10 rounded-lg bg-[#159EAE]/10 text-[#159EAE] flex items-center justify-center shrink-0 hover:bg-[#159EAE] hover:text-white transition-colors"
                      title="Send Email"
                    >
                      <span className="material-symbols-outlined text-[20px]">mail</span>
                    </a>
                    <div>
                      <h3 className="text-sm font-bold text-[#12305A] mb-1">Email Us</h3>
                      <a
                        href="mailto:admissionbychoice@gmail.com"
                        className="text-sm text-[#0757C9] hover:underline block"
                      >
                        admissionbychoice@gmail.com
                      </a>
                      <p className="text-xs text-[#5F6F82]">Response within 24 hours</p>
                    </div>
                  </div>

                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Park+Rd,+near+Honey+Dew+School,+Samadar+path,+Kadamkuan,+Patna,+Bihar+800003"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-3 -mx-3 rounded-xl hover:bg-[#F7FAFD] transition-colors group cursor-pointer"
                    title="Open in Google Maps"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#0757C9]/10 text-[#0757C9] flex items-center justify-center shrink-0 group-hover:bg-[#0757C9] group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-[20px]">location_on</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <h3 className="text-sm font-bold text-[#12305A] group-hover:text-[#0757C9] transition-colors">Office Address</h3>
                        <span className="material-symbols-outlined text-[14px] text-[#0757C9] opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
                      </div>
                      <p className="text-sm text-[#5F6F82] leading-relaxed">
                        Park Rd, near Honey Dew School,<br />
                        Samadar path, Kadamkuan,<br />
                        Patna, Bihar 800003
                      </p>
                    </div>
                  </a>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#0757C9] to-[#06449E] rounded-2xl p-6 sm:p-8 text-white shadow-md">
                <h2 className="text-xl font-bold mb-3">Need Immediate Assistance?</h2>
                <p className="text-sm text-white/90 mb-6 leading-relaxed">
                  Our admission counselors are available for immediate consultation. Schedule a direct callback or call our admission advisory desk.
                </p>
                <a
                  href="tel:+917879084889"
                  className="w-full py-2.5 px-4 rounded-lg bg-white text-[#0757C9] text-sm font-bold hover:bg-white/90 transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  <span className="material-symbols-outlined text-[18px]">phone_in_talk</span>
                  <span>Call +91 78790 84889</span>
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
};
