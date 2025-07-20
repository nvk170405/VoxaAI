"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Twitter, Facebook, Instagram, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-gray-100 py-10 rounded-xl font-montserrat">
      <div className=" bg-neutral-950 mx-auto px-6 sm:px-12 lg:px-20">
        {/* Footer Top */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand Info */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Voxa</h2>
            <p className="text-gray-400">
              Your AI-powered journaling companion. Helping you reflect, grow, and organize your thoughts with ease.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/features" className="hover:text-gray-100 transition">
                  Features
                </a>
              </li>
              <li>
                <a href="/pricing" className="hover:text-gray-100 transition">
                  Pricing
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-gray-100 transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-gray-100 transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Twitter className="w-6 h-6 hover:text-blue-400 transition" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <Facebook className="w-6 h-6 hover:text-blue-600 transition" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Instagram className="w-6 h-6 hover:text-pink-500 transition" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="w-6 h-6 hover:text-gray-400 transition" />
              </a>
            </div>
          </div>
        </div>

        {/* Separator */}
        <Separator className="my-8 bg-gray-700" />

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Voxa. All rights reserved.</p>
          <div className="mt-4 sm:mt-0 flex space-x-4">
            <a href="/terms" className="hover:text-gray-100 transition">
              Terms of Service
            </a>
            <a href="/privacy" className="hover:text-gray-100 transition">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
