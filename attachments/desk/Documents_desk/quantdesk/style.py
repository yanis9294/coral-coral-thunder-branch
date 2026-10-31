"""Thème graphique « terminal » (fond noir, ambre / cyan) cohérent avec un écran de trading."""
import matplotlib as mpl
import matplotlib.pyplot as plt

AMBER, CYAN, GREEN, RED, GREY, VIOLET = "#ffa028", "#3fd0ff", "#4fd67a", "#ff4d4d", "#8a8f98", "#b48cff"
PALETTE = [AMBER, CYAN, GREEN, RED, VIOLET, "#f2e05c", "#ff7bb0", GREY]


def apply_terminal_style():
    mpl.rcParams.update({
        "figure.facecolor": "#0b0d10", "axes.facecolor": "#0b0d10", "savefig.facecolor": "#0b0d10",
        "axes.edgecolor": "#30343b", "axes.labelcolor": "#c9ced6", "text.color": "#e6e9ee",
        "xtick.color": "#9aa1ab", "ytick.color": "#9aa1ab", "grid.color": "#1e2228", "grid.linestyle": "-",
        "axes.grid": True, "axes.prop_cycle": mpl.cycler(color=PALETTE), "legend.facecolor": "#12151a",
        "legend.edgecolor": "#30343b", "font.size": 10, "figure.dpi": 110, "axes.titleweight": "bold",
        "axes.titlecolor": AMBER, "axes.spines.top": False, "axes.spines.right": False,
    })
