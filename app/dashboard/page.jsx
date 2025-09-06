"use client"

import { useEffect, useState } from "react"
import {
  TrendingUp,
  Plus,
  Minus,
  LogOut,
  Menu,
  X,
  MessageCircle,
  HelpCircle,
  Users,
  ArrowUpCircle,
  ArrowDownCircle,
  Receipt,
  DollarSign,
  Coins,
  Send,
  History,
  Crown,
  Gift,
  User,
  ChevronRight,
  Smartphone,
  Download,
  Globe,
} from "lucide-react"
import { FaWhatsapp, FaTelegramPlane } from "react-icons/fa"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

import Link from "next/link"
import axios from "axios"
import WithdrawModal from "@/components/WithdrawModal"
import InvestModal from "@/components/InvestModal"
import Image from "next/image"
import CustomerSupportModal from "@/components/customer-support-modal"
import { useUser } from "../context/UserContext"

import logo from '@/public/mepx.png'
import { ShareWithFriends } from "@/components/share-with-friends"
import DashboardLayout from "@/components/DashboardLayout"
import AnnouncementModal from "@/components/announcement-modal"
import HelpButtonGuide from "@/components/help-button-guide"
import { SupportsData } from "@/components/SupportsData"
import { AdsSlider } from "@/components/AdsSlider"

export default function NFTInvestmentDashboard() {
  const [investModalOpen, setInvestModalOpen] = useState(false)
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false)
  const [supportModalOpen, setSupportModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [investmentPlans, setPlans] = useState(null)
  const [investAmount, setInvestAmount] = useState()

  function fetchPlans() {
    axios.get("https://stocktitan.site/api/plans").then((res) => {
      setPlans(res?.data?.plans)
    })
  }

  useEffect(() => {
    fetchPlans()
  }, [])

  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { url: "/dashboard/deposit/log", title: "My Deposits", icon: ArrowDownCircle },
    { url: "/dashboard/withdraw/log", title: "My Withdrawals", icon: ArrowUpCircle },
    { url: "/dashboard/transactions/log", title: "My Transactions", icon: Receipt },
    { url: "/dashboard/investments/log", title: "My Investments", icon: TrendingUp },
    { url: "/dashboard/profit/daily", title: "My Daily Profits", icon: DollarSign },
    { url: "/dashboard/profit/total", title: "My Total Profits", icon: Coins },
    { url: "/dashboard/referral_commissions", title: "Referral Commissions", icon: Users },
    { url: "/dashboard/transfer", title: "Transfer Amount", icon: Send },
    { url: "/dashboard/transfer/log", title: "All Transfers", icon: History },
    { url: "/dashboard/team", title: "My Team", icon: Users },
    { url: "/dashboard/user-rank", title: "Ranks", icon: Crown },
    { url: "/dashboard/user-rank/rewards", title: "Rank Rewards", icon: Gift },
    { url: "/dashboard/profile", title: "Profile", icon: User },
    { url: "", title: "Customer Support", icon: MessageCircle, action: () => setSupportModalOpen(true) },
  ]

  const { logout, user, token, fetchUser } = useUser();

  useEffect(() => {
    fetchUser()
  }, []);

  const [showHelpGuide, setShowHelpGuide] = useState(false)

  useEffect(() => {
    const hasSeenHelpGuide = localStorage.getItem("hasSeenHelpGuide")
    if (!hasSeenHelpGuide) {
      const timer = setTimeout(() => {
        setShowHelpGuide(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleCloseHelpGuide = () => {
    setShowHelpGuide(false)
    localStorage.setItem("hasSeenHelpGuide", "true")
  }

  const whatsappGroupLink = "https://chat.whatsapp.com/Cu7aLUqkrHKD3KmlLA8TFO?mode=ems_copy_t"
  const telegramGroupLink = "https://t.me/+MQGeKfl-lZEyMDhk"
  const joinWhatsAppGroup = () => {
    window.open(whatsappGroupLink, "_blank")
  }
  const joinTelegramGroup = () => {
    window.open(telegramGroupLink, "_blank")
  }

  return (
    <DashboardLayout>
      <AnnouncementModal />
      {showHelpGuide && <HelpButtonGuide onClose={handleCloseHelpGuide} />}
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-gray-800 to-green-900 flex pb-30">
        {isOpen && <div className="fixed inset-0 bg-white/20 backdrop-blur-sm z-30" onClick={() => setIsOpen(false)} />}
        <div
          className={`fixed inset-y-0 my-auto h-[90%] ${isOpen ? "left-[0]" : "-left-[100%]"} w-80 bg-gray-900/95 backdrop-blur-xl border-r border-emerald-500/30 rounded-r-2xl p-6 flex flex-col z-30 duration-300 shadow-2xl`}
        >
          <Link href={"/dashboard/profile"} className="flex items-center gap-4 pb-6 mb-6 border-b border-gray-700/50">
            <div className="relative">
              <Image src={logo || "/placeholder.svg"} alt="logo" width={48} height={48} className="rounded-xl" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-gray-900"></div>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-white leading-tight">{user?.username}</h2>
              <p className="text-sm text-gray-400 mt-1">{user?.phone}</p>
            </div>
          </Link>

          <div className="flex flex-col gap-1 flex-1 overflow-y-auto">
            {menuItems.map((item, i) => {
              const IconComponent = item.icon
              return item.action ? (
                <button
                  key={i}
                  onClick={item.action}
                  className="group flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-400 text-gray-300 transition-all duration-200 text-left"
                >
                  <IconComponent className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                  <span className="font-medium flex-1">{item.title}</span>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ) : (
                <Link
                  key={i}
                  href={item.url}
                  className="group flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-400 text-gray-300 transition-all duration-200"
                >
                  <IconComponent className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                  <span className="font-medium flex-1">{item.title}</span>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              )
            })}
          </div>

          <button
            onClick={logout}
            className="group flex items-center gap-4 px-4 py-3 mt-6 rounded-xl border border-red-500/20 hover:bg-red-500/10 hover:border-red-500/40 text-red-400 hover:text-red-300 font-medium transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6 pb-32">
            <div className="w-full">
              <div className="flex items-center justify-between mb-6">
                <Link href={'/dashboard/profile'} className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <Image src={logo} alt="logo" width={40} height={40} />
                  </Avatar>
                  <div>
                    <h1 className="text-white font-semibold">Hi, {user?.username}!</h1>
                    <p className="text-gray-400 text-sm">Welcome back!</p>
                  </div>
                </Link>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className=" bg-white text-gray-800 p-2 rounded-full shadow-md"
                >
                  {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
              <Card className="bg-gray-950/30 border-green-800/50 mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Balance</span>
                    <div className="flex items-center gap-1">
                      <span className="text-green-400 text-sm">24% ↑</span>
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-4">PKR {Number(user?.balance ?? 0).toFixed(2)}</div>

                  {/* Quick Action Buttons */}
                  <div className="flex gap-3">
                    <Button className="flex-1 bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-600/30">
                      <Link className="w-full flex items-center gap-1" href={"/dashboard/deposit"}>
                        <Plus className="h-4 w-4 mr-2" />
                        Deposit
                      </Link>
                    </Button>
                    <Button
                      onClick={() => setWithdrawModalOpen(true)}
                      className="flex-1 bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 border border-orange-600/30"
                    >
                      <Minus className="h-4 w-4 mr-2" />
                      Withdraw
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <div className="flex items-center mb-6 gap-3" style={{
                position: 'fixed',
                top: '65%',
                width: '25px',
                left: 0,
                zIndex: 10,
                transform: 'rotate(270deg)'
              }}>
                <Button
                  onClick={joinWhatsAppGroup}
                  className="bg-green-600 hover:bg-green-700 text-white text-xs flex items-center gap-2"
                >
                  <FaWhatsapp className="h-3 w-3" />
                  Join Group
                </Button>

                <Button
                  onClick={joinTelegramGroup}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs flex items-center gap-2"
                >
                  <FaTelegramPlane className="h-3 w-3" />
                  Join Group
                </Button>
              </div>
              <Card className="bg-gradient-to-r from-emerald-900/30 to-green-800/30 border-emerald-500/30 mb-6">
                <CardContent className="p-6">
                  <div className="text-center">
                    <h2 className="flex items-center justify-center gap-2 mb-3 text-xl font-bold text-white">Download Application
                      <Download className="h-6 w-6 text-emerald-400" />
                    </h2>
                    <p className="text-gray-300 mb-6">
                      Get the best experience with our mobile app or continue using our web platform
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        className="bg-green-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-200 flex items-center gap-3"
                        onClick={() => {
                          // Add your app store/play store link here
                          window.open("https://expo.dev/artifacts/eas/2gj3Rb1zsQ2GoZHC6PogQj.apk", "_blank")
                        }}
                      >
                        <Smartphone className="h-5 w-5" />
                        Download Mobile App
                      </Button>
                    </div>

                    <div className="mt-4 text-sm text-gray-400">
                      <p>✓ Secure transactions • ✓ Real-time updates • ✓ 24/7 support</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <AdsSlider />
              <div className="mb-6 mt-6">
                <h2 className="text-white text-lg font-semibold mb-4">Investment Opportunities</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                  {investmentPlans?.length ? (
                    investmentPlans.map((plan, index) => (
                      <Card
                        key={plan.id}
                        className="group pt-4 pb-1 relative bg-gradient-to-br from-slate-900/80 via-gray-800/60 to-emerald-900/40 backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-400/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1"
                      >
                        {index === 0 && (
                          <div className="absolute -top-1 -right-1 z-20">
                            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold px-3 py-1 rounded-bl-xl rounded-tr-2xl shadow-lg">
                              ⭐ Most Popular
                            </Badge>
                          </div>
                        )}

                        {plan?.lock != 0 && (
                          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-gray-900/60 to-black/70 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-3 text-white rounded-2xl">
                            <div className="p-4 bg-red-500/20 rounded-full border border-red-400/30">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-red-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                              </svg>
                            </div>
                            <div className="text-center">
                              <span className="text-lg font-bold uppercase tracking-wider">Plan Locked</span>
                              <p className="text-sm text-gray-300 mt-1">Coming Soon</p>
                            </div>
                          </div>
                        )}

                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-xl border border-emerald-500/30 group-hover:border-emerald-400/50 transition-colors">
                                  <TrendingUp className="h-6 w-6 text-emerald-400" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                              </div>
                              <div>
                                <h3 className="text-sm font-bold text-white mb-1 group-hover:text-emerald-100 transition-colors">
                                  {plan.plan_name}
                                </h3>
                                <p className="text-sm text-gray-400 font-medium">{plan?.time?.name}</p>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-sm font-bold text-yellow-400">
                                {Number(plan.return_interest ?? 0)}%
                              </p>
                              <p className="text-xs text-green-500">
                                {plan?.time?.time == 1
                                  ? "Hourly"
                                  : plan?.time?.time == 24
                                    ? "Daily"
                                    : plan?.how_many_time == 1 && plan?.time?.time != 1
                                      ? "Accumulated Profit"
                                      : ""}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-800/50 to-gray-800/30 rounded-xl border border-gray-700/50">
                              <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">
                                  Investment Range
                                </p>
                                {plan?.minimum_amount == null || plan?.minimum_amount < 1 ? (
                                  <span className="text-lg font-bold text-green-400">
                                    PKR {Number(plan.invest_limit ?? 0).toLocaleString()}
                                  </span>
                                ) : (
                                  <span className="text-lg font-bold">
                                    <span className="text-green-400">
                                      PKR {Number(plan.minimum_amount ?? 0).toLocaleString()}
                                    </span>
                                    <span className="text-gray-400 mx-2">to</span>
                                    <span className="text-green-400">
                                      PKR {Number(plan.maximum_amount ?? 0).toLocaleString()}
                                    </span>
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
                              <span className="text-xs text-gray-400 font-medium">Capital Return Policy</span>
                              <Badge
                                className={`${plan.capital_back
                                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                  : "bg-orange-500/20 text-orange-300 border-orange-500/30"
                                  } font-semibold`}
                              >
                                {plan.capital_back ? "✅ Guaranteed" : "❌ Not Included"}
                              </Badge>
                            </div>
                            <div className="text-right">
                              {plan?.lock == 0 && (
                                <Button
                                  onClick={() => {
                                    setSelectedPlan(plan)
                                    setInvestModalOpen(true)
                                  }}
                                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-sm font-semibold px-4 py-1.5 rounded-lg shadow-md hover:shadow-emerald-500/25 transition-all duration-200 transform hover:scale-105"
                                >
                                  Invest
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="border border-gray-200 rounded-lg shadow animate-pulse p-6 dark:border-gray-700">
                      <div className="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700"></div>
                      <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {user ?
              <ShareWithFriends user={user} /> : ""
            }
            <SupportsData />
          </div>
        </div>

        <Button
          className="fixed bottom-40 right-4 bg-green-600 hover:bg-green-700 text-white rounded-full w-12 h-12 shadow-lg z-30"
          size="icon"
        >
          <Link href={'/help'}>
            <MessageCircle className="h-3 w-3" />
          </Link>
        </Button>

        <Button
          className="fixed bottom-55 right-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 shadow-lg z-30"
          size="icon"
          onClick={() => { setSupportModalOpen(true) }}
        >
          <HelpCircle className="h-3 w-3" />
        </Button>

        <InvestModal
          balance={Number(user?.balance ?? 0).toFixed(0)}
          setInvestAmount={setInvestAmount}
          investAmount={investAmount}
          setInvestModalOpen={setInvestModalOpen}
          investModalOpen={investModalOpen}
          selectedPlan={selectedPlan}
        />
        <WithdrawModal
          withdrawModalOpen={withdrawModalOpen}
          setWithdrawModalOpen={setWithdrawModalOpen}
          loginToken={token}
        />

        <CustomerSupportModal isOpen={supportModalOpen} onClose={() => setSupportModalOpen(false)} />
      </div>
    </DashboardLayout>
  )
}
