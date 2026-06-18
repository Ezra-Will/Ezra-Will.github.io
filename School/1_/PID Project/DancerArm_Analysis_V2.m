%% ENGR 3540 - Dancer Arm ANALYSIS V2

clear; clc; close all;

%% 1. CALIBRATED PARAMETERS
InitialDepth = 483;  
TargetDepth  = 350;  
K_mech = 0.075;     
tau_motor = 0.15;   % Motor response time

%% 2. PLC Register Sync
D513_Kp = 1700;     
D514_Ti = 300;      
D515_Td = 1300;     

Kp = D513_Kp / 100;
Ti = D514_Ti * 0.1; 
Td = D515_Td * 0.01; 

%% 3. System Modeling
s = tf('s');
Gp = K_mech / (s * (tau_motor*s + 1)); 
N = 0.8; % Heavy filter to match physical smoothness
Gc = Kp * (1 + 1/(Ti*s) + (Td*s)/(1 + (Td/N)*s));
T = feedback(Gc * Gp, 1);

%% 4. PHYSICAL SIMULATION
t_sim = 0:0.01:6; [y_unit, t] = step(T, t_sim);
y_sim = InitialDepth + (TargetDepth - InitialDepth) * y_unit;

%% 5. DATA IMPORT & ROBUST ALIGNMENT
log_file = 'log2_500mm_to_350mm.txt'; has_data = false;
if exist(log_file, 'file')
    data = readmatrix(log_file, 'NumHeaderLines', 3, 'Delimiter', '\t', 'FileType', 'text');
    if ~isempty(data)
        t_raw_ms = data(:,2); y_raw = data(:,5);
        t_plc_full = zeros(size(t_raw_ms)); current_time = 0;
        for i = 2:length(t_raw_ms)
            diff = t_raw_ms(i) - t_raw_ms(i-1);
            if diff < 0, diff = diff + 1000; end 
            current_time = current_time + diff;
            t_plc_full(i) = current_time / 1000;
        end
        % Center the curve perfectly
        start_idx = find(y_raw < (y_raw(1) - 15), 1, 'first');
        if ~isempty(start_idx)
            t_plc = t_plc_full(start_idx:end) - t_plc_full(start_idx) + 0.15;
            y_plc = y_raw(start_idx:end);
            has_data = true;
        end
    end
end

%% 6. VISUALIZATION
figure('Name', 'Final Validation', 'Color', 'w', 'Position', [100, 100, 900, 600]);
plot(t, y_sim, 'b', 'LineWidth', 3, 'DisplayName', 'MATLAB Model'); hold on;
if has_data
    plot(t_plc, y_plc, 'r.', 'MarkerSize', 8, 'DisplayName', 'Physical PLC Data');
end
line([0 6], [TargetDepth TargetDepth], 'Color', [0 0.5 0], 'LineStyle', '--', 'LineWidth', 2, 'DisplayName', 'Setpoint');
title('Final Validation: Precision Model Sync');
xlabel('Time (seconds)'); ylabel('Arch Depth (mm)');
legend('Location', 'northeast'); grid on; axis([0 5 300 500]);
