import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Chip,
  Divider,
  Fab
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import KeyboardIcon from '@mui/icons-material/Keyboard';

const shortcuts = [
  { keys: ['Ctrl', 'N'], description: 'Create new project', mac: ['⌘', 'N'] },
  { keys: ['Escape'], description: 'Close modal/dialog' },
  { keys: ['?'], description: 'Show this help dialog' },
  { keys: ['G', 'P'], description: 'Go to Projects page' },
  { keys: ['G', 'D'], description: 'Go to Dashboard' },
];

function ShortcutRow({ shortcut }) {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const keys = isMac && shortcut.mac ? shortcut.mac : shortcut.keys;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
      <Typography variant="body2">{shortcut.description}</Typography>
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {keys.map((key, index) => (
          <Chip
            key={index}
            label={key}
            size="small"
            variant="outlined"
            sx={{
              minWidth: 32,
              height: 24,
              fontSize: '0.75rem',
              fontFamily: 'monospace'
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

export default function KeyboardShortcutsHelp() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Fab
        size="small"
        color="default"
        aria-label="keyboard shortcuts"
        onClick={() => setOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          backgroundColor: 'background.paper',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      >
        <KeyboardIcon />
      </Fab>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HelpOutlineIcon />
            <Typography variant="h6">Keyboard Shortcuts</Typography>
          </Box>
          <IconButton onClick={() => setOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Use these keyboard shortcuts to navigate faster:
          </Typography>
          <Box>
            {shortcuts.map((shortcut, index) => (
              <React.Fragment key={index}>
                <ShortcutRow shortcut={shortcut} />
                {index < shortcuts.length - 1 && <Divider sx={{ my: 0.5 }} />}
              </React.Fragment>
            ))}
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            Press '?' anywhere to open this dialog
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
}
