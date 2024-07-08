"use client";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { FormEvent } from "react";
import axios from "axios";
import Chat from "@/app/pages/chat/[chatId]/page";
import Auth from "@/app/pages/auth/[roomId]/page";
import Settings from "./pages/settings/[settingsId]/page";

export default function Home() {
  return <Auth />;
}
