import { useCurrentUser } from "@/entities/user/hooks/useCurrentUser";
import { HOST } from "@/helpers/api";
import { getItem } from "@/helpers/localStorage";
import {
  Alert,
  Badge,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { Bell, X } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import io from "socket.io-client";

interface Notification {
  id: string;
  type: string;
  message: string;
  createdAt: string;
  read: boolean;
}

function isNotification(value: unknown): value is Notification {
  if (!value || typeof value !== "object") return false;
  const item = value as Notification;
  return (
    typeof item.id === "string" &&
    typeof item.type === "string" &&
    typeof item.message === "string" &&
    typeof item.createdAt === "string" &&
    Number.isFinite(Date.parse(item.createdAt))
  );
}

// A bounded browser history, not a substitute for a server inbox/outbox.
function loadHistory(key: string): Notification[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(data)
      ? data
          .filter(isNotification)
          .slice(0, 100)
          .map((item) => ({ ...item, read: item.read === true }))
      : [];
  } catch {
    return [];
  }
}

export const NotifyDrawer = () => {
  const userId = useCurrentUser()?.id;
  const token = getItem("token");
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [connected, setConnected] = useState(false);
  const history = useRef<Notification[]>([]);
  const storageKey = userId ? `delivery.notifications.${userId}` : null;

  const save = (items: Notification[]) => {
    history.current = items;
    setNotifications(items);
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(items));
      } catch {
        /* Storage can be disabled. */
      }
    }
  };

  useEffect(() => {
    setOpen(false);
    setConnected(false);
    history.current = storageKey ? loadHistory(storageKey) : [];
    setNotifications(history.current);
    if (!storageKey || !token) return;
    const socket = io(HOST, { auth: { token }, withCredentials: true });
    const receive = (value: unknown) => {
      if (
        !isNotification(value) ||
        history.current.some((item) => item.id === value.id)
      )
        return;
      const items = [{ ...value, read: false }, ...history.current].slice(
        0,
        100
      );
      history.current = items;
      setNotifications(items);
      try {
        localStorage.setItem(storageKey, JSON.stringify(items));
      } catch {
        /* Keep in memory. */
      }
      toast(value.message, { id: value.id, icon: "🔔" });
    };
    const sync = (event: StorageEvent) => {
      if (event.key !== storageKey) return;
      history.current = loadHistory(storageKey);
      setNotifications(history.current);
    };
    socket.on("newNotification", receive);
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("connect_error", () => setConnected(false));
    window.addEventListener("storage", sync);
    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      window.removeEventListener("storage", sync);
    };
  }, [storageKey, token]);

  const unread = notifications.filter((item) => !item.read).length;
  return (
    <>
      <IconButton
        aria-label={`Уведомления, непрочитанных: ${unread}`}
        onClick={() => setOpen(true)}
      >
        <Badge badgeContent={unread} color="error" max={99}>
          <Bell size={30} />
        </Badge>
      </IconButton>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{ width: { xs: "100vw", sm: 400 }, p: 3 }}
          role="region"
          aria-label="Уведомления"
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6">Уведомления</Typography>
            <IconButton
              aria-label="Закрыть уведомления"
              onClick={() => setOpen(false)}
            >
              <X />
            </IconButton>
          </Stack>
          {!connected && (
            <Alert severity="warning" sx={{ my: 2 }}>
              Нет соединения. Уведомления в реальном времени временно недоступны.
            </Alert>
          )}
          <Stack direction="row" spacing={1} sx={{ my: 2 }}>
            <Button
              disabled={!unread}
              onClick={() =>
                save(history.current.map((item) => ({ ...item, read: true })))
              }
            >
              Прочитать все
            </Button>
            <Button disabled={!notifications.length} onClick={() => save([])}>
              Очистить
            </Button>
          </Stack>
          {!notifications.length ? (
            <Typography color="text.secondary" sx={{ py: 4 }}>
              Здесь появятся уведомления о ваших заказах.
            </Typography>
          ) : (
            <List disablePadding>
              {notifications.map((item) => (
                <ListItemButton
                  key={item.id}
                  selected={!item.read}
                  aria-label={`${item.read ? "Прочитано" : "Не прочитано"}: ${
                    item.message
                  }`}
                  onClick={() =>
                    save(
                      history.current.map((entry) =>
                        entry.id === item.id ? { ...entry, read: true } : entry
                      )
                    )
                  }
                  sx={{ borderRadius: 2, mb: 1 }}
                >
                  <ListItemText
                    primary={item.message}
                    primaryTypographyProps={{ sx: { whiteSpace: "pre-line" } }}
                    secondary={new Date(item.createdAt).toLocaleString("ru-RU")}
                  />
                </ListItemButton>
              ))}
            </List>
          )}
        </Box>
      </Drawer>
    </>
  );
};
