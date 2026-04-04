import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { PanelLeft } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const SIDEBAR_COOKIE_NAME = "sidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

const SidebarContext = React.createContext(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

const SidebarProvider = React.forwardRef((props, ref) => {
  const {
    defaultOpen = true,
    open: openProp,
    onOpenChange: setOpenProp,
    className,
    style,
    children,
    ...rest
  } = props;

  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);

  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;

  const setOpen = React.useCallback(
    (value) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) setOpenProp(openState);
      else _setOpen(openState);

      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open]
  );

  const toggleSidebar = React.useCallback(() => {
    return isMobile
      ? setOpenMobile((o) => !o)
      : setOpen((o) => !o);
  }, [isMobile, setOpen]);

  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  const state = open ? "expanded" : "collapsed";

  const contextValue = React.useMemo(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, toggleSidebar]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          ref={ref}
          style={{
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
            ...style,
          }}
          className={cn("group/sidebar-wrapper flex min-h-svh w-full", className)}
          {...rest}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
});

const Sidebar = React.forwardRef((props, ref) => {
  const {
    side = "left",
    variant = "sidebar",
    collapsible = "offcanvas",
    className,
    children,
    ...rest
  } = props;

  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent
          side={side}
          className="w-[--sidebar-width] bg-sidebar p-0"
          style={{ "--sidebar-width": SIDEBAR_WIDTH_MOBILE }}
        >
          {children}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div ref={ref} className={cn("hidden md:block", className)} {...rest}>
      <div className="fixed inset-y-0 w-[--sidebar-width] bg-sidebar">
        {children}
      </div>
    </div>
  );
});

const SidebarTrigger = React.forwardRef((props, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button ref={ref} size="icon" variant="ghost" onClick={toggleSidebar} {...props}>
      <PanelLeft />
    </Button>
  );
});

const SidebarContent = React.forwardRef((props, ref) => (
  <div ref={ref} className={cn("flex flex-col flex-1 overflow-auto", props.className)} {...props} />
));

const SidebarHeader = React.forwardRef((props, ref) => (
  <div ref={ref} className={cn("p-2", props.className)} {...props} />
));

const SidebarFooter = React.forwardRef((props, ref) => (
  <div ref={ref} className={cn("p-2", props.className)} {...props} />
));

const SidebarMenu = React.forwardRef((props, ref) => (
  <ul ref={ref} className={cn("flex flex-col gap-1", props.className)} {...props} />
));

const SidebarMenuItem = React.forwardRef((props, ref) => (
  <li ref={ref} {...props} />
));

const SidebarMenuButton = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <button
      ref={ref}
      className={cn("flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent", className)}
      {...rest}
    />
  );
});

export {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
};